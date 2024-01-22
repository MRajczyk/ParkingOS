import { PrismaClient } from "@prisma/client";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
    const prisma: PrismaClient = event.context.prisma;
    const session = await getServerSession(event);
    if (!session) {
        throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
    }

    const body = await readBody(event);

    //@ts-ignore
    if (body.userId === session.user?.id) {
        return { statusCode: 400 };
    }

    const date = body.date;
    const year = parseInt(date.substring(0, 2), 10) + 2000;
    const month = parseInt(date.substring(2, 4), 10) - 1;
    const day = (date.substring(4, 6));
    const hours = (date.substring(6, 8));
    const minutes = (date.substring(8, 10));
    const entranceDate = new Date(year, month, day, hours, minutes)

    try {
        const exists = await prisma.parkingSession.findFirst({
            where: {
                parkingId: +body.parkingId,
                spot: body.spot,
                carId: +body.car,
                leaveDate: null
            }
        })

        if (exists) {
            throw { result: "Session already exists." };
        }

        const validate = await prisma.car.findFirst({
            where: {
                id: +body.car,
                userId: +body.userId,
            }
        })
        console.log(4);

        if (!validate) {
            throw { result: "This user doesn't own this car." };
        }

        const session1 = await prisma.parkingSession.create({
            data: {
                ticket: body.ticket,
                entranceDate: entranceDate,
                finalCost: 0,
                parkingId: +body.parkingId,
                spot: body.spot,
                carId: +body.car,
                userId: +body.userId,
            },
        });

        return session1;
    } catch (error) {
        throw error;
    }
});
