import { PrismaClient } from "@prisma/client";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  const prisma: PrismaClient = event.context.prisma;
  const session = await getServerSession(event);

  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const { id } = getRouterParams(event);

  try {
    const sumOfMonthlyCosts = await prisma.monthlyCost.aggregate({
      where: {
        parkingId: Number(id),
      },
      _sum: {
        costValue: true,
      },
    });

 
    return {
      statusCode: 200,
   
        sum: sumOfMonthlyCosts._sum.costValue || 0,
      
    };
  } catch (error) {
    console.error(error);
    throw createError({
      statusMessage: "Error fetching parking details",
      statusCode: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
});
