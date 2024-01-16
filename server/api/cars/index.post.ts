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
      statusCode: 418,
    });
  }

  try {
    const createdCar = await prisma.car.create({
      data: {
        userId: Number.parseInt(body.userId),
        name: body.name,
        registrationNumber: body.licensePlateNumber,
        isParked: false,
      },
    });
    if (createdCar) {
      return {
        statusMessage: "Car added successfully",
      };
    } else {
      throw createError({
        statusMessage: "Car creating error",
        statusCode: 400,
      });
    }
  } catch (e) {
    //@ts-expect-error
    console.log(e.message);
    throw createError({
      statusMessage: "Car creation error",
      statusCode: 400,
    });
  }
});
