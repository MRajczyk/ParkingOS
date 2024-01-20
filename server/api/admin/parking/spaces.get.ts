import { PrismaClient } from "@prisma/client";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
    const prisma: PrismaClient = event.context.prisma;
    const session = await getServerSession(event);
    const query = getQuery(event);

    if (!session) {
        throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
    }

    try {
        if (query.id) {
            const spaces = await prisma.parkingSpace.findMany({
                where: {
                    parkingId: +query.id,
                },
                orderBy: {
                    id: 'asc',
                }
            });

            return spaces;
        } else {
            throw { statusCode: 404 };
        }
    } catch (error) {
        throw error;
    }
});
