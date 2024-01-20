import { getServerSession } from "#auth";
import { PrismaClient } from "@prisma/client";
import { Role } from "@prisma/client";

export default defineEventHandler(async (event) => {
    const prisma: PrismaClient = event.context.prisma;
    const session = await getServerSession(event);
    const body = await readBody(event);

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

    try {
        const spaces = await prisma.parkingSpace.findMany({
            take: +body.ctr,
            where: {
                parkingId: body.parkingId,
            },
            orderBy: {
                id: 'desc',
            }
        })

        const spaceIdsToDelete = spaces.map(space => space.id);

        await prisma.parkingSpace.deleteMany({
            where: {
                id: {
                    in: spaceIdsToDelete,
                },
            },
        });

        return {
            statusMessage: "deleted successfully",
        };

    } catch (e) {
        //@ts-expect-error
        console.log(e.message);
        throw createError({
            statusMessage: "Error deleting data",
            statusCode: 400,
        });
    }
});
