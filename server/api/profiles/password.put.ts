import { getServerSession } from "#auth";
import { PrismaClient } from "@prisma/client";
import { hash, compareSync } from "bcrypt";
import { checkPassword } from "../../../utils/utils";

export default eventHandler(async (event) => {
  const SALT_ROUNDS = 10;
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

  if (
    !body.currentPassword ||
    !checkPassword(body.currentPassword) ||
    !body.newPassword ||
    !checkPassword(body.newPassword)
  ) {
    throw createError({
      statusMessage:
        "Password must contain at least one lowercase, one uppercase, one digit and one special character while being 8 characters long.",
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

    const passwordValid = compareSync(body.currentPassword, foundUser.password);
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
        password: await hash(body.newPassword, SALT_ROUNDS),
      },
    });
    if (updateUser) {
      return {
        statusMessage: "Password updated successfully",
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
