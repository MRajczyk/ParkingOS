import { PrismaClient } from "@prisma/client";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
    const prisma: PrismaClient = event.context.prisma;
    const session = await getServerSession(event);
    if (!session) {
        throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
    }

    try {
        const parkings = await prisma.parking.findMany({
            select: {
                id: true,
                name: true,
                city: true,
                address: true,
            },
            orderBy: {
                city: 'asc',
            }
        });

        return parkings;
    } catch (error) {
        throw error;
    }
});
