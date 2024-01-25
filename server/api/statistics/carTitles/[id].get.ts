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
     const car = await prisma.car.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!car) {
      throw createError({ statusMessage: "Car not found", statusCode: 404 });
    }

      
    return {
      statusCode: 200,
      data: {
        registrationNumber: car.registrationNumber,
       },
    };
  } catch (error) {
    console.error(error);
    throw createError({
      statusMessage: "Error fetching car details",
      statusCode: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
});
