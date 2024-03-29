import { getServerSession } from "#auth";
import { PrismaClient } from "@prisma/client";

export default eventHandler(async (event) => {
  const prisma: PrismaClient = event.context.prisma;
  const session = await getServerSession(event);
  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const body = await readBody(event);
  // @ts-ignore
  if (!Number.isNaN(body.id) && session.user?.id !== body.id) {
    throw createError({
      statusMessage: "Invalid session",
      statusCode: 418,
    });
  }

  console.log(body.amount);
  if (!body.amount || body.amount < 0) {
    throw createError({
      statusMessage: "Invalid deposit amount",
      statusCode: 418,
    });
  }

  try {
    const balance = await prisma.user.findFirst({
      select: {
        balance: true,
      },
      where: {
        id: Number.parseInt(body.id),
      },
    });

    if (balance && typeof balance.balance === 'number') {
      if (balance?.balance - body.amount < 0) {
        throw createError({
          statusMessage: "Not enough money",
          statusCode: 418,
        });
      }
    } else {
      throw createError({
        statusMessage: "Not enough money",
        statusCode: 418,
      });
    }

    const updateUser = await prisma.user.update({
      where: {
        id: Number.parseInt(body.id),
      },
      data: {
        balance: {
          increment: -body.amount,
        },
      },
    });
    if (updateUser) {
      return {
        statusMessage: "Balance added successfully",
        newBalance: updateUser.balance,
      };
    } else {
      throw createError({
        statusMessage: "Profile update error",
        statusCode: 400,
      });
    }
  } catch (e) {
    //@ts-expect-error
    console.log(e.message);
    return e;
  }
});
