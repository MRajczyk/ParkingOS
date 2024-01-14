import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { createTransport } from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { sha512 } from "js-sha512";

export default eventHandler(async (event) => {
  const SALT_ROUNDS = 10;
  const prisma: PrismaClient = event.context.prisma;

  const body = await readBody(event);
  if (!body.email) {
    return { statusMessage: "Sent email if user exists in the database" };
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });
    if (!user) {
      return { statusMessage: "Sent email if user exists in the database" };
    }

    const token = uuidv4();
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: sha512(token),
        expiration: moment().utc().add(30, "m").format(),
      },
    });

    const transporter = createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.GMAIL_APP_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
    console.log(
      "Go to following url to reset password at Parking OS: localhost:3000/forgot-password/" +
        token +
        " . Link is valid for 30 minutes."
    );
    const info = await transporter.sendMail({
      from: process.env.GMAIL_APP_EMAIL,
      to: body.email,
      subject: "ParkingOS password reset",
      text:
        "Go to following url to reset password at Parking OS: localhost:3000/forgot-password/" +
        token,
      html: `<p>Go to following url to reset password at Parking OS: <a>localhost:3000/forgot-password/${token}<a/> Link is valid only for 30 minutes.</p>`,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (e) {
    console.log(e);
  } finally {
    return { statusMessage: "Sent email if user exists in the database" };
  }
});
