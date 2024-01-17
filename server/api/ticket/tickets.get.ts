import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const prisma: PrismaClient = event.context.prisma;
  const userId = getQuery(event).id as number;

  const tickets = await prisma.parkingSession.findMany({
    where: {
      userId: +userId,
      leaveDate: null,
    }
  });

  return tickets;
});