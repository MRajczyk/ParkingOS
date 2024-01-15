import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const prisma: PrismaClient = event.context.prisma;
  const userId = getQuery(event).userId as number;

  const cars = await prisma.car.findMany({
    where: {
      userId: +userId,
      isParked: false,
    }
  });

  return cars;
});
