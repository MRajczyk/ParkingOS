import { PrismaClient } from "@prisma/client";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  const prisma: PrismaClient = event.context.prisma;
  const session = await getServerSession(event);
  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }


  const uniqueCities = await prisma.parking.findMany({
    distinct: ['city'],
  });

  return uniqueCities.map((parking) => parking.city);
});
