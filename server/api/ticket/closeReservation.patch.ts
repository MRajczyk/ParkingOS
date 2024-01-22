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
        return { statusCode: 200 };
    }

    const date = new Date();

    try {
        const test = await prisma.parkingSession.findFirst({
            where: {
                id: body.ticketId,
                userId: body.userId,
            },
        });

        console.log(test); 

        const session1 = await prisma.parkingSession.update({
            where: {
                id: body.ticketId,
                userId: body.userId,
            },
            data: {
                leaveDate: date,
                finalCost: body.cost,
            },
        });

        return session1;
    } catch (error) {
        throw error;
    }
});
