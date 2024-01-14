import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import moment from "moment";
import { sha512 } from "js-sha512";

function checkPassword(str: string) {
  var re =
    /^(?=.*[0-9])(?=.*[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~])[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~*]{8,}$/;
  return re.test(str);
}

export default eventHandler(async (event) => {
  const SALT_ROUNDS = 10;
  const prisma: PrismaClient = event.context.prisma;

  const body = await readBody(event);

  if (!body.token) {
    throw createError({
      statusMessage: "Malformed token",
      statusCode: 400,
    });
  }

  if (!checkPassword(body.password)) {
    throw createError({
      statusMessage: "Failed to reset password - password is too weak",
      statusCode: 400,
    });
  }

  const hashedToken = sha512(body.token);
  try {
    const foundToken = await prisma.passwordResetToken.findFirst({
      where: {
        token: hashedToken,
      },
    });
    console.log(foundToken);

    if (!foundToken) {
      throw createError({
        statusMessage: "Invalid password reset token",
        statusCode: 400,
      });
    }

    if (moment(foundToken.expiration).isBefore(moment().utc())) {
      throw createError({
        statusMessage: "Token has expired",
        statusCode: 400,
      });
    }

    //update password
    await prisma.user.update({
      where: {
        id: foundToken.userId,
      },
      data: {
        password: await hash(body.password, SALT_ROUNDS),
      },
    });

    //revoke all previous password recovery tokens
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: foundToken.userId,
      },
    });
    return { statusMessage: "Password changed successfully" };
  } catch (e) {
    console.log(e);
    throw createError({
      statusMessage: "Password reset unsucessfull",
      statusCode: 400,
    });
  }
});
