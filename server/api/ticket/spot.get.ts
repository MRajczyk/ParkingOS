import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const prisma: PrismaClient = event.context.prisma;
  const parkingId = getQuery(event).id as number;

  const space = await prisma.parkingSpace.findFirst({
    where: {
        parkingId: +parkingId,
        ocuppied: false,
    }
  });

  if (!space) {
    return { error: "found nothing" };
  }
  else {
    return space;
  }
});
