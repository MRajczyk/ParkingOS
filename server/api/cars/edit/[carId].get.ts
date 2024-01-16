import { getServerSession } from "#auth";
import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const { carId } = getRouterParams(event);
  const prisma: PrismaClient = event.context.prisma;
  const session = await getServerSession(event);
  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  if (Number.isNaN(carId)) {
    throw createError({
      statusMessage: "Invalid session",
      statusCode: 418,
    });
  }

  try {
    const car = await prisma.car.findFirst({
      where: {
        id: Number.parseInt(carId),
      },
    });
    // @ts-ignore
    if (car && car.userId === Number.parseInt(session.user?.id)) {
      return { statusCode: 200, data: car };
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
