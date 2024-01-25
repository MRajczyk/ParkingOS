import { PrismaClient } from "@prisma/client";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  const prisma: PrismaClient = event.context.prisma;
  const session = await getServerSession(event);
  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }
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
