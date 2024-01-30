import { PrismaClient } from "@prisma/client";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
    const prisma: PrismaClient = event.context.prisma;
    const session = await getServerSession(event);
    if (!session) {
        throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
    }
    const id = getQuery(event).id as string;

    const parkingSession = await prisma.parkingSession.findFirst({
        where: {
            ticket: id,
        },
    });

    return parkingSession;
});
