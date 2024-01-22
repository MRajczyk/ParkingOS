import { PrismaClient } from "@prisma/client";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  const prisma: PrismaClient = event.context.prisma;
  const session = await getServerSession(event);
  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const body = await readBody(event);
  let state: boolean;

  try {
    state = JSON.parse(body.isParked);
  } catch (error) {
    throw error;
  }

  try {
    const car = await prisma.car.update({
      where: {
        id: +body.id,
      },
      data: {
        isParked: state,
      },
    });

    return car;
  } catch (error) {
    throw error;
  }
});
