import { PrismaClient } from "@prisma/client";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  const prisma: PrismaClient = event.context.prisma;
  const session = await getServerSession(event);
  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }
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
