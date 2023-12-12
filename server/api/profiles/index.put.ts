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
  if (session.user?.username !== body.username) {
    throw createError({
      statusMessage: "Nieprawidłowa sesja",
      statusCode: 418,
    });
  }

  const updateUser = await prisma.user.update({
    where: {
      username: body.username,
    },
    data: {
      email: body.email,
      password: await hash(body.password, SALT_ROUNDS),
    },
  });
  if (updateUser) {
    return {
      statusMessage: "Zmiana hasła przebiegła poprawnie!",
    };
  } else {
    throw createError({
      statusMessage: "Internal server error",
      statusCode: 500,
    });
  }
});
