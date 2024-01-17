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
      statusMessage: "Invalid cost Id",
      statusCode: 404,
    });
  }

  try {
    await prisma.monthlyCost.delete({
      where: {
        id: Number.parseInt(costId),
      },
    });
    return {
      statusMessage: "Monthly cost deleted successfully",
    };
  } catch (e) {
    //@ts-expect-error
    console.log(e.message);
    throw createError({
      statusMessage: "Error deleting data",
      statusCode: 400,
    });
  }
});
