import { PrismaClient } from "@prisma/client";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  const prisma: PrismaClient = event.context.prisma;
  const session = await getServerSession(event);

  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const {  spaceId } = getRouterParams(event);

  try {
    const space = await prisma.parkingSpace.findUnique({
      where: {
        id:  Number(spaceId),
         
      },
    });

   const parking = await prisma.parking.findUnique({
    where: {
      id:  space.id,
       
    },
  });
  const cars = await prisma.car.findMany();

     const parkingSessions = await prisma.parkingSession.findMany({
      where: {
        spot:  Number(spaceId),
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
          name: parking.name,
carName:  car.name,
registrationNumber: car.registrationNumber,



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