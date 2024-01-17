import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const prisma: PrismaClient = event.context.prisma;
  const city = getQuery(event).city as string;

  const parkings = await prisma.parking.findMany({
    where: {
        city: city,
    }
  });

  return parkings;
});
