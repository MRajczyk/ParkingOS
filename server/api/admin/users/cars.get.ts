import { PrismaClient } from "@prisma/client";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
    const prisma: PrismaClient = event.context.prisma;
    const session = await getServerSession(event);
    if (!session) {
        throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
    }

    const userId = getQuery(event).userId as number;

    const cars = await prisma.car.findMany({
        select: {
            id: true,
            registrationNumber: true,
        },
        where: {
            userId: +userId,
        }
    });

    return cars;
});
