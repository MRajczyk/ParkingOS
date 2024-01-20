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
   
const parking = await prisma.parking.findUnique({
  where: {
    id: Number(id),
  },
  include: {
    monthlyCosts: true,
    parkingPlaces: true, // Jeśli potrzebujesz szczegółów parkingPlaces, dostosuj zapytanie
    chargePlan: true,
  },
});

// Zapytanie dla sesji parkowania
const parkingSessions = await prisma.parkingSession.findMany({
  where: {
    parkingId: Number(id),
  },
  include: {
    car: true,
    user: true,
  },
});
 
     const maxCapacity = parking.floors * parking.parkingPlacesPerFloor;
    const revenueGenerated = parkingSessions.reduce((totalRevenue, session) => {
      if (session.leaveDate !== null) {
        return totalRevenue + (session.finalCost || 0);
      }
      return totalRevenue;
    }, 0);
    
    const carsParkedToDate = parkingSessions.length;
    const sumOfMonthlyCosts = parking.monthlyCosts.reduce((totalCost, monthlyCost) => {
      return totalCost + monthlyCost.costValue;
    }, 0);

    // Zwróć dane w odpowiedzi
    return {
      statusCode: 200,
      data: {
        maxCapacity,
        revenueGenerated,
        carsParkedToDate,
        sumOfMonthlyCosts,
      },
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