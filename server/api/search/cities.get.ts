import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const prisma: PrismaClient = event.context.prisma;

  const uniqueCities = await prisma.parking.findMany({
    distinct: ['city'],
  });

  return uniqueCities.map((parking) => parking.city);
});
