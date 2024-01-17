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
      statusMessage: "Invalid car Id",
      statusCode: 404,
    });
  }

  try {
    const car = await prisma.car.findFirst({
      where: {
        id: Number.parseInt(carId),
      },
    });
    if (!car || car.isParked) {
      throw createError({
        statusMessage: "Error deleting data",
        statusCode: 400,
      });
    }
    // @ts-ignore
    if (car.userId === Number.parseInt(session.user?.id)) {
      await prisma.car.update({
        where: {
          id: Number.parseInt(carId),
        },
        data: {
          markedForDeletion: true,
        },
      });
    }
    return {
      statusMessage: "Car deleted successfully",
    };
  } catch (e) {
    //@ts-expect-error
    if (e.statusMessage && e.statusMessage === "You are not the owner.") {
      throw createError({
        statusCode: 404,
        statusMessage: "You are not the owner.",
      });
    }
    //@ts-expect-error
    console.log(e.message);
    throw createError({
      statusMessage: "Error deleting data",
      statusCode: 400,
    });
  }
});
