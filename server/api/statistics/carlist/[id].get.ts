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
     const allCars = await prisma.car.findMany();

     const parkingSessions = await prisma.parkingSession.findMany({
      where: {
        parkingId: Number(id),
      },
    });

     const uniqueCarIds = [...new Set(parkingSessions.map((session) => session.carId))];

     const selectedCars = allCars.filter((car) => uniqueCarIds.includes(car.id));

     const resultData = selectedCars.map((car) => ({
      id: car.id,
      registrationNumber: car.registrationNumber,
    }));

     return {
      statusCode: 200,
      resultData,
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
