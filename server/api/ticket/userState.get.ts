import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const prisma: PrismaClient = event.context.prisma;
  const userId = getQuery(event).id as number;

  const user = await prisma.user.findFirst({
    where: {
      id: +userId,
    }
  });

  if (!user) {
    return "Error";
  }
  else {
    return user.isBanned;
  }
});
