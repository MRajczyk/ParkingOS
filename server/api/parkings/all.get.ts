// server/api/parkings/all.get.ts
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  const prisma: PrismaClient = event.context.prisma;
  const session = await getServerSession(event);

  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  try {
    // Sprawdzamy, czy użytkownik ma uprawnienia do pobrania wszystkich parkingów
    // if (session.user?.role !== "admin") {
    //   throw createError({
    //     statusMessage: "Unauthorized",
    //     statusCode: 401,
    //   });
    // }

    const allParkings = await prisma.parking.findMany();

    return {
      statusCode: 200,
      data: allParkings,
    };
  } catch (error) {
    console.error(error);
    throw createError({
      statusMessage: "Error fetching parking data",
      statusCode: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
});
