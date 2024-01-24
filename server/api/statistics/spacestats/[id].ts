import { PrismaClient } from "@prisma/client";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  const prisma: PrismaClient = event.context.prisma;
  const session = await getServerSession(event);

  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const { id} = getRouterParams(event);

  try {
    const parkingSessions = await prisma.parkingSession.findMany({
        where: {
          spot: Number(id),
          leaveDate: {
            not: null,
          },
        },
      });
      
      const resultData = [];
      
      for (const session of parkingSessions) {
        const car = await prisma.car.findUnique({
          where: {
            id: session.carId,
          },
          select: {
            registrationNumber: true,
            name: true,
          },
        });
      
        if (car) {
          const newData = {
            id:session.id,
            entranceDate: session.entranceDate,
            leaveDate: session.leaveDate,
            totalCost: session.finalCost,
            name: car.name,
            registrationNumber: car.registrationNumber,
            spot: session.spot,
          };
      
          resultData.push(newData);
        }
      }
      
       

      const sortData = resultData.sort((a, b) => {
         const dateA = new Date(a.entranceDate);
        const dateB = new Date(b.entranceDate);
      
        return dateB.getTime() - dateA.getTime();
      });
      


      return {
      statusCode: 200,
      sortData,
    };
  } catch (error) {
    console.error(error);
    throw createError({
      statusMessage: "Error fetching parking session details",
      statusCode: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
});
