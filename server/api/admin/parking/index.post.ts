import { PrismaClient } from "@prisma/client";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
    const prisma: PrismaClient = event.context.prisma;
    const session = await getServerSession(event);
    if (!session) {
        throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
    }

    //@ts-expect-error
    if (session.user?.role !== Role.ADMIN) {
        throw createError({
            statusMessage: "You are not an admin.",
            statusCode: 403,
        });
    }

    const body = await readBody(event);

    try {
        const parking = await prisma.parking.create({
            data: {
                name: body.name,
                city: body.city,
                address: body.address,
                floors: body.floors,
                parkingPlacesPerFloor: body.spaces,
            },
        });

        const chargePlan = await prisma.chargePlan.create({
            data: {
                parkingId: parking.id,
                nightStart: body.start,
                nightEnd: body.end,
                dayHour1Tariff: body.day1,
                dayHour2Tariff: body.day2,
                dayHour3Tariff: body.day3,
                dayHour4Tariff: body.day4,
                nightHour1Tariff: body.night1,
                nightHour2Tariff: body.night2,
                nightHour3Tariff: body.night3,
                nightHour4Tariff: body.night4,
            },
        });

        const parkingSpaces = [];
        for (let index = 0; index < body.floors * body.spaces; index++) {
            parkingSpaces[index] = await prisma.parkingSpace.create({
                data: {
                    ocuppied: false,
                    parkingId: parking.id,
                }
            });
        }

        return [parking, chargePlan, parkingSpaces];
    } catch (error) {
        throw error;
    }
});
