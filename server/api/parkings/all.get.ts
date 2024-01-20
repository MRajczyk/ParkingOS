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
