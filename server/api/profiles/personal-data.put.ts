import { getServerSession } from "#auth";
import { PrismaClient } from "@prisma/client";
import { compareSync } from "bcrypt";

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
      statusMessage: "Invalid user id in request",
      statusCode: 400,
    });
  }

  if (
    !body.name ||
    body.name.length < 1 ||
    !body.surname ||
    body.surname.length < 1
  ) {
    throw createError({
      statusMessage: "Invalid data",
      statusCode: 400,
    });
  }

  try {
    const foundUser = await prisma.user.findFirst({
      where: {
        id: Number.parseInt(body.id),
      },
    });

    if (!foundUser) {
      throw createError({
        statusMessage: "Invalid user id",
        statusCode: 400,
      });
    }

    const passwordValid = compareSync(body.password, foundUser.password);
    if (!passwordValid) {
      throw createError({
        statusMessage: "Invalid password",
        statusCode: 400,
      });
    }

    const updateUser = await prisma.user.update({
      where: {
        id: Number.parseInt(body.id),
      },
      data: {
        name: body.name,
        surname: body.surname,
      },
    });
    if (updateUser) {
      return {
        statusMessage: "User updated successfully",
      };
    } else {
      throw createError({
        statusMessage: "Profile update error",
        statusCode: 400,
      });
    }
  } catch (e) {
    throw createError({
      //@ts-expect-error
      statusMessage: e.message,
      statusCode: 400,
    });
  }
});
