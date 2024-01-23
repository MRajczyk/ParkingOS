import { PrismaClient } from "@prisma/client";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  const prisma: PrismaClient = event.context.prisma;
  const session = await getServerSession(event);
  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const parkingId = getQuery(event).id as number;

  const spaces = await prisma.parkingSpace.findMany({
    where: {
      parkingId: +parkingId,
      available: true,
    },
    orderBy: {
      id: 'asc',
    }
  });

  const space = await prisma.parkingSpace.findFirst({
    where: {
      parkingId: +parkingId,
      ocuppied: false,
      available: true,
    },
    orderBy: {
      id: 'asc',
    }
  });

  if (!space) {
    return { error: "found nothing" };
  }
  else {
    return [ space, spaces.findIndex((s) => s.id === space.id )];
  }
});
