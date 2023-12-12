import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { Role } from "@prisma/client";

export default eventHandler(async (event) => {
  const SALT_ROUNDS = 10;
  const prisma: PrismaClient = event.context.prisma;

  const body = await readBody(event);
  const createUser = await prisma.user.create({
    data: {
      username: body.username,
      email: body.email,
      password: await hash(body.password, SALT_ROUNDS),
      role: Role.USER,
    },
  });

  if (createUser) {
    return { statusMessage: "Rejestracja pomyślna!" };
  } else {
    throw createError({
      statusMessage: "Internal server error",
      statusCode: 500,
    });
  }
});
