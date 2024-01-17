import { getServerSession } from "#auth";
import { PrismaClient } from "@prisma/client";

export default eventHandler(async (event) => {
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
  // @ts-ignore
  if (Number.isNaN(body.costId) || Number.isNaN(body.parkingId)) {
    throw createError({
      statusMessage: "Invalid cost or parking id",
      statusCode: 404,
    });
  }

  if (
    !body.costName ||
    body.costName.length === 0 ||
    !body.costValue ||
    Number.isNaN(body.costValue) ||
    body.costValue < 0
  ) {
    throw createError({
      statusMessage: "Invalid value or name of the cost",
      statusCode: 404,
    });
  }

  try {
    const createdCar = await prisma.monthlyCost.create({
      data: {
        parkingId: Number.parseInt(body.parkingId),
        costName: body.costName,
        costValue: Number.parseInt(body.costValue),
      },
    });
    if (createdCar) {
      return {
        statusMessage: "Monthly cost created successfully",
      };
    } else {
      throw createError({
        statusMessage: "Error creating monthly cost",
        statusCode: 400,
      });
    }
  } catch (e) {
    throw createError({
      statusMessage: "Error creating monthly cost",
      statusCode: 400,
    });
  }
});
