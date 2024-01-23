import { PrismaClient } from "@prisma/client";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  const prisma: PrismaClient = event.context.prisma;
  const session = await getServerSession(event);
  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }
  const city = getQuery(event).city as string;

  const parkings = await prisma.parking.findMany({
    where: {
      city: city,
      parkingPlaces: {
        some: {
          ocuppied: false,
          available: true,
        },
      },
    },
    include: {
      chargePlan: true,
    },
  });

  return parkings;
});
