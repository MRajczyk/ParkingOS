import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const prisma: PrismaClient = event.context.prisma;
  const parkingId = getQuery(event).id as number;

  const parking = await prisma.parking.findFirst({
    where: {
      id: +parkingId,
    }
  });

  if (!parking) {
    return "Error";
  }
  else {
    return parking;
  }
});
