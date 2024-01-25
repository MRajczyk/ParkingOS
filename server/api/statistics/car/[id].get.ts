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
   
   const parkings = await prisma.parking.findMany();
   
     const parkingSessions = await prisma.parkingSession.findMany({
      where: {
        carId:  Number(id),
        leaveDate: {
          not: null,
        },
      },
    });

 
    const resultData = parkingSessions.map((session) => {
      const parking = parkings.find((parking) => parking.id === session.parkingId);

      if (parking) {
        return {
           id: session.id,
          entranceDate: session.entranceDate,
          leaveDate: session.leaveDate,
          totalCost: session.finalCost,
          name: parking.name,
           spot: session.spot,
        };
      } else {
        return null;
      }
    });


    const sortData = resultData.sort((a, b) => {
       const dateA = new Date(a.entranceDate);
      const dateB = new Date(b.entranceDate);
    
      return dateB.getTime() - dateA.getTime();
    });
        const filteredResultData = sortData.filter((data) => data !== null);

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