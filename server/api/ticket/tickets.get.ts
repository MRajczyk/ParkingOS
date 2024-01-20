import { PrismaClient } from "@prisma/client";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  const prisma: PrismaClient = event.context.prisma;
  const session = await getServerSession(event);
  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }
  const userId = getQuery(event).id as number;
  //@ts-ignore
  if (userId === Number.parseInt(session.user?.id)) {
    return { statusCode: 200 };
  }

  const tickets = await prisma.parkingSession.findMany({
    where: {
      userId: +userId,
      leaveDate: null,
    }
  });

  return tickets;
});