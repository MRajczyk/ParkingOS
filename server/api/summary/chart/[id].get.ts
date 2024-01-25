import { PrismaClient } from "@prisma/client";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  const prisma: PrismaClient = event.context.prisma;
  const session = await getServerSession(event);

  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const { id } = getRouterParams(event);

  try {
    const parkingSessions = await prisma.parkingSession.findMany({
      where: {
        parkingId: Number(id),
        leaveDate: {
          not: null,
        },
      },
      select: {
        id: true,
        leaveDate: true,
        finalCost: true,
      },
    });

     const transformedSessions = parkingSessions.map(session => {
      return {
        id:session.id,
        leaveDate: formatDate(session.leaveDate),
        finalCost: session.finalCost,
      };
    });

    return {
      statusCode: 200,
       transformedSessions,
    };
  } catch (error) {
    console.error(error);
    throw createError({
      statusMessage: "Error fetching parking sessions",
      statusCode: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
});

 function formatDate(date) {
  const formattedDate = new Date(date);
  return formattedDate.toISOString().split("T")[0];
}
