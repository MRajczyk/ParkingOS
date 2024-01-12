import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { Role } from "@prisma/client";
import { createTransport } from "nodemailer";

export default eventHandler(async (event) => {
  const SALT_ROUNDS = 10;
  const prisma: PrismaClient = event.context.prisma;

  const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.GMAIL_APP_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "mikolajrajczyk01@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);

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
