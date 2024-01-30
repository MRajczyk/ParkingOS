import { PrismaClient } from "@prisma/client";
import { getServerSession } from "#auth";

//endpoint do zmiany
export default defineEventHandler(async (event) => {
  const prisma: PrismaClient = event.context.prisma;
  const session = await getServerSession(event);

  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const { id } = getRouterParams(event);

  try {
    const sumOfMonthlyCosts = await prisma.monthlyCost.findMany({
      where: {
        parkingId: Number(id),
      },
    });

    return {
      statusCode: 200,
      costs: sumOfMonthlyCosts,
    };
  } catch (error) {
    console.error(error);
    throw createError({
      statusMessage: "Error fetching parking's costs",
      statusCode: 500,
    });
  }
});
