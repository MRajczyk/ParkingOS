import { getServerSession } from "#auth";
import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const { userId } = getRouterParams(event);
  const prisma: PrismaClient = event.context.prisma;
  const session = await getServerSession(event);
  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  // @ts-ignore
  if (Number.isNaN(userId) || session.user?.id !== userId) {
    throw createError({
      statusMessage: "Invalid session",
      statusCode: 404,
    });
  }

  try {
    const userCars = await prisma.car.findMany({
      where: {
        userId: Number.parseInt(userId),
        markedForDeletion: false,
      },
    });
    if (userCars) {
      return { statusCode: 200, data: userCars };
    }
    return {
      statusCode: 404,
      statusMessage: "Invalid userId",
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
