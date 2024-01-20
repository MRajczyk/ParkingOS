import { getServerSession } from "#auth";
import { PrismaClient } from "@prisma/client";
import { Role } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const prisma: PrismaClient = event.context.prisma;
  const session = await getServerSession(event);

  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }
  //@ts-expect-error
  if (session.user?.role !== Role.ADMIN) {
    throw createError({
      statusMessage: "You are not an admin.",
      statusCode: 403,
    });
  }

  if (Number.isNaN(id)) {
    throw createError({
      statusMessage: "Invalid session",
      statusCode: 404,
    });
  }

  try {
    const parking = await prisma.parking.findFirst({
      where: {
        id: Number.parseInt(id),
      },
      include: {
        chargePlan: true,
      }
    });

    // @ts-ignore
    if (parking) {
      return parking;
    }
    return {
      statusCode: 404,
      statusMessage: "Invalid Id",
    };
  } catch (e) {
    //@ts-expect-error
    console.log(e.message);
    throw createError({
      statusMessage: "Error fetching data",
      statusCode: 400,
    });
  }
});
