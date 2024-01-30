import { PrismaClient, Role } from "@prisma/client";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
    const prisma: PrismaClient = event.context.prisma;
    const session = await getServerSession(event);
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

    const body = await readBody(event);

    try {
        const user = await prisma.user.update({
            where: {
                id: +body.id,
            },
            data: {
                isBanned: body.isBanned,
            },
        });

        return user;
    } catch (error) {
        throw error;
    }
});
