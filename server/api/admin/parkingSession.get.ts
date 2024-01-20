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

    return parkingSession;
});
