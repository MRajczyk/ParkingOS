import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
    const prisma: PrismaClient = event.context.prisma;
    const body = await readBody(event);

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

        if(exists) {
            console.log("Can't create session.")
            throw { result: "Can't create session." };
        }

        const session = await prisma.parkingSession.create({
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

        return session;
    } catch (error) {
        throw error;
    }
});
