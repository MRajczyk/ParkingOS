import { PrismaClient } from "@prisma/client";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
    const prisma: PrismaClient = event.context.prisma;
    const session = await getServerSession(event);
    if (!session) {
        throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
    }

    const body = await readBody(event);
    let state: boolean;

    try {
        state = JSON.parse(body.ocuppied);
    } catch (error) {
        throw error;
    }

    console.log(body);

    try {
        const space = await prisma.parkingSpace.update({
            where: {
                id: +body.id,
            },
            data: {
                ocuppied: state,
            },
        });

        return space;
    } catch (error) {
        throw error;
    }
});
