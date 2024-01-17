import { getServerSession } from "#auth";
import { PrismaClient } from "@prisma/client";
import { Role } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const { costId } = getRouterParams(event);
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

  if (Number.isNaN(costId)) {
    throw createError({
      statusMessage: "Invalid session",
      statusCode: 404,
    });
  }

  try {
    const monthlyCost = await prisma.monthlyCost.findFirst({
      where: {
        id: Number.parseInt(costId),
      },
    });
    // @ts-ignore
    if (monthlyCost) {
      return { statusCode: 200, data: monthlyCost };
    }
    return {
      statusCode: 404,
      statusMessage: "Invalid cost Id",
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
