import { getServerSession } from "#auth";
import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const { parkingId } = getRouterParams(event);
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

  // @ts-ignore
  if (Number.isNaN(parkingId)) {
    throw createError({
      statusMessage: "Invalid parking id",
      statusCode: 404,
    });
  }

  try {
    const parkingMonthlyCosts = await prisma.monthlyCost.findMany({
      where: {
        parkingId: Number.parseInt(parkingId),
      },
    });
    if (parkingMonthlyCosts) {
      return { statusCode: 200, data: parkingMonthlyCosts };
    }
    throw createError({
      statusCode: 404,
      statusMessage: "Invalid parking Id",
    });
  } catch (e) {
    //@ts-expect-error
    if (e.message && e.message === "Invalid parking Id") {
      throw createError({
        statusCode: 404,
        statusMessage: "Invalid parking Id",
      });
    }
    //@ts-expect-error
    console.log(e.message);
    throw createError({
      statusMessage: "Error fetching data",
      statusCode: 400,
    });
  }
});
