import { PrismaClient } from "@prisma/client";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  const prisma: PrismaClient = event.context.prisma;
  const session = await getServerSession(event);
  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const userId = getQuery(event).userId as number;
  //@ts-ignore
  if (userId === Number.parseInt(session.user?.id)) {
    return { statusCode: 200 };
  }

  const cars = await prisma.car.findMany({
    where: {
      userId: +userId,
      isParked: false,
    }
  });

  return cars;
});
