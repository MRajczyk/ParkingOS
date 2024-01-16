import { getServerSession } from "#auth";
import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const prisma: PrismaClient = event.context.prisma;
  const session = await getServerSession(event);
  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  // @ts-ignore
  if (Number.isNaN(id) || session.user?.id !== id) {
    throw createError({
      statusMessage: "Invalid session",
      statusCode: 404,
    });
  }

  try {
    const foundUser = await prisma.user.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    });
    if (foundUser) {
      return { statusCode: 200, data: foundUser.balance };
    }
    return {
      statusCode: 404,
      statusMessage: "User not found",
    };
  } catch (e) {
    //@ts-expect-error
    console.log(e.message);
    throw createError({
      statusMessage: "Error fetching data",
      statusCode: 400,
    });
  }
});
