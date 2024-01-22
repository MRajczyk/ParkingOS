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
    // Pobierz wszystkie auta
    const allCars = await prisma.car.findMany();

    // Pobierz wszystkie samochody, które parkowały na danym parkingu
    const parkingSessions = await prisma.parkingSession.findMany({
      where: {
        parkingId: Number(id),
      },
    });

    // Znajdź unikalne id samochodów, które występują na liście pobranych parking session
    const uniqueCarIds = [...new Set(parkingSessions.map((session) => session.carId))];

    // Wyfiltruj auta na podstawie znalezionych id
    const selectedCars = allCars.filter((car) => uniqueCarIds.includes(car.id));

    // Zbierz dane do zwrócenia
    const resultData = selectedCars.map((car) => ({
      id: car.id,
      registrationNumber: car.registrationNumber,
    }));

    // Zwróć dane w odpowiedzi
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
