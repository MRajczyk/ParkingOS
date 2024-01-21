import { PrismaClient } from "@prisma/client";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  const prisma: PrismaClient = event.context.prisma;
  const session = await getServerSession(event);

  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const { id , carid } = getRouterParams(event);

  try {
    // Pobierz wszystkie auta
    const cars = await prisma.car.findMany({
      where: {
        id: Number(carid),
      },
    });

    // Pobierz wszystkie sesje parkowania dla danego parkingu
    const parkingSessions = await prisma.parkingSession.findMany({
      where: {
        parkingId: Number(id),
        carId:  Number(carid),
        leaveDate: {
          not: null,
        },
      },
    });

 
    const resultData = parkingSessions.map((session) => {
      const car = cars.find((car) => car.id === session.carId);

      if (car) {
        return {
           id: session.id,
          entranceDate: session.entranceDate,
          leaveDate: session.leaveDate,
          totalCost: session.finalCost,
          name: car.name,
          registrationNumber: car.registrationNumber,
          spot: session.spot,
        };
      } else {
        return null;
      }
    });


    const sortData = resultData.sort((a, b) => {
      // Parse the dates and compare them
      const dateA = new Date(a.entranceDate);
      const dateB = new Date(b.entranceDate);
    
      return dateB.getTime() - dateA.getTime();
    });
        const filteredResultData = sortData.filter((data) => data !== null);

    // Zwróć dane w odpowiedzi
    return {
      statusCode: 200,
      filteredResultData,
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