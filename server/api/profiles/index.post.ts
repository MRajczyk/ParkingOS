import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { Role } from "@prisma/client";

export default eventHandler(async (event) => {
  const SALT_ROUNDS = 10;
  const prisma: PrismaClient = event.context.prisma;

  const body = await readBody(event);
  const createUser = await prisma.user.create({
    data: {
      name: body.name,
      surname: body.surname,
      email: body.email,
      password: await hash(body.password, SALT_ROUNDS),
      role: Role.USER,
      isBanned: false,
      balance: 0,
    },
  });

  if (createUser) {
    return { statusMessage: "Rejestracja pomyślna!" };
  } else {
    throw createError({
      statusMessage: "Register unsucessfull",
      statusCode: 400,
    });
  }
});
