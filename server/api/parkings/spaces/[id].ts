import { PrismaClient } from "@prisma/client";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  const prisma: PrismaClient = event.context.prisma;
  const session = await getServerSession(event);

  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const { id } = getRouterParams(event);
   console.log(id)

  try {
    const parkingSpaces = await prisma.parkingSpace.findMany({
        where: {
            parkingId: Number.parseInt(id),
        },
        
      });
const parkingSpaceIds = parkingSpaces.map(space => space.id)
    // Zwróć dane w odpowiedzi
    return {
        statusCode: 200,
        data: {
          parkingSpaceIds,
        },
      };
  } catch (error) {
    console.error(error);
    throw createError({
      statusMessage: "Error fetching parking space details",
      statusCode: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
});
