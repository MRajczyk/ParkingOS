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
    body.costValue < 0
  ) {
    throw createError({
      statusMessage: "Invalid value or name of the cost",
      statusCode: 404,
    });
  }

  try {
    await prisma.monthlyCost.update({
      where: { id: body.costId, parkingId: body.parkingId },
      data: {
        costName: body.costName,
        costValue: body.costValue,
      },
    });

    return {
      statusMessage: "Monthly cost updated successfully",
    };
  } catch (e) {
    //@ts-expect-error
    console.log(e.message);
    throw createError({
      statusMessage: "Cost update error",
      statusCode: 400,
    });
  }
});
