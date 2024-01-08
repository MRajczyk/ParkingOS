import { getServerSession } from "#auth";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

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

  try {
    const updateUser = await prisma.user.update({
      where: {
        id: Number.parseInt(body.id),
      },
      data: {
        email: body.email,
        name: body.name,
        surname: body.surname,
        password: await hash(body.password, SALT_ROUNDS),
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
    console.log(e.message);
  }
});
