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
    body.licensePlateNumber.length < 3
  ) {
    throw createError({
      statusMessage: "Invalid name or license plate number",
      statusCode: 404,
    });
  }

  try {
    const carToCheckRegistrationNumberAvailability = await prisma.car.findFirst(
      {
        where: {
          registrationNumber: body.licensePlateNumber.toUpperCase(),
          markedForDeletion: false,
        },
      }
    );
    if (carToCheckRegistrationNumberAvailability) {
      throw createError({
        statusMessage: "Car with given registration number already exists",
        statusCode: 400,
      });
    }
  } catch (e) {
    throw createError({
      statusMessage: "Car with given registration number already exists",
      statusCode: 400,
    });
  }

  try {
    const createdCar = await prisma.car.create({
      data: {
        userId: Number.parseInt(body.userId),
        name: body.name,
        registrationNumber: body.licensePlateNumber.toUpperCase(),
        isParked: false,
      },
    });
    if (createdCar) {
      return {
        statusMessage: "Car added successfully",
      };
    } else {
      throw createError({
        statusMessage: "Error creating car",
        statusCode: 400,
      });
    }
  } catch (e) {
    if (
      //@ts-expect-error
      e.code === "P2002"
    ) {
      throw createError({
        statusMessage:
          "Car with provided license plate number already exists in the system.",
        statusCode: 400,
      });
    }
    throw createError({
      statusMessage: "Error creating car",
      statusCode: 400,
    });
  }
});
