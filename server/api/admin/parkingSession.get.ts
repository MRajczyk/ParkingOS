import { PrismaClient } from "@prisma/client";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
    const prisma: PrismaClient = event.context.prisma;
    const session = await getServerSession(event);
    if (!session) {
        throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
    }
    const id = getQuery(event).parkingId as number;
    const spot = getQuery(event).spot as number;

    const parkingSession = await prisma.parkingSession.findFirst({
        where: {
            parkingId: +id,
            spot: +spot,
            leaveDate: null,
        },
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 59);

    const totalDay = await prisma.parkingSession.aggregate({
        _sum: {
            finalCost: true,
        },
        where: {
            parkingId: +id,
            spot: +spot,
            leaveDate: {
                gte: todayStart,
                lt: todayEnd,
            },
        }
    })

    return [ parkingSession, totalDay ];
});
