import { getServerSession } from "#auth";
import { PrismaClient } from "@prisma/client";

export default eventHandler(async (event) => {
  const prisma: PrismaClient = event.context.prisma;
  const session = await getServerSession(event);
  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const body = await readBody(event);
  // @ts-ignore
  if (Number.isNaN(body.userId) || session.user?.id !== body.userId) {
    throw createError({
      statusMessage: "Invalid session",
      statusCode: 404,
    });
  }

  if (
    !body.name ||
    body.name.length === 0 ||
    !body.licensePlateNumber ||
    body.licensePlateNumber.length < 3 ||
    !body.carId ||
    Number.isNaN(body.carId)
  ) {
    throw createError({
      statusMessage: "Invalid car details",
      statusCode: 400,
    });
  }

  try {
    const car = await prisma.car.findFirst({
      where: {
        id: Number.parseInt(body.carId),
      },
    });
    if (car && car.isParked) {
      throw createError({
        statusMessage:
          "Can't update info of parked car. Exit the parking first.",
        statusCode: 400,
      });
    }
    //@ts-expect-error
    if (car && car.userId === Number.parseInt(session.user.id)) {
      await prisma.car.update({
        where: { id: Number.parseInt(body.carId) },
        data: { name: body.name, registrationNumber: body.licensePlateNumber },
      });

      return {
        statusMessage: "Car updated successfully",
      };
    } else {
      throw createError({
        statusMessage: "Car update error",
        statusCode: 400,
      });
    }
  } catch (e) {
    if (
      //@ts-expect-error
      e.statusMessage &&
      //@ts-expect-error
      e.statusMessage ===
        "Can't update info of parked car. Exit the parking first."
    ) {
      throw createError({
        statusMessage:
          "Can't update info of parked car. Exit the parking first.",
        statusCode: 400,
      });
    }
    //@ts-expect-error
    console.log(e.message);
    throw createError({
      statusMessage: "Car update error",
      statusCode: 400,
    });
  }
});
