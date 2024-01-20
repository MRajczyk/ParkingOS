import { PrismaClient, Role } from "@prisma/client";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  const prisma: PrismaClient = event.context.prisma;
  const session = await getServerSession(event);
  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const users = await prisma.user.findMany({
    select: {
        id: true,
        email: true,
        balance: true,
        isBanned: true,
    },
    where: {
      role: Role.USER,
    }
  });

  if (!users) {
    return { error: "Error" };
  }
  else {
    return users;
  }
});
