import { getServerSession } from "#auth";
import { PrismaClient } from "@prisma/client";
import { Role } from "@prisma/client";

export default eventHandler(async (event) => {
  const prisma: PrismaClient = event.context.prisma;
  const session = await getServerSession(event);

  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  //@ts-expect-error
  if (session.user?.role !== Role.ADMIN) {
    throw createError({
      statusMessage: "You are not an admin.",
      statusCode: 403,
    });
  }

  const body = await readBody(event);
  // @ts-ignore
  if (!body.parkingId || Number.isNaN(body.parkingId)) {
    throw createError({
      statusMessage: "Invalid cost or parking id",
      statusCode: 404,
    });
  }

  if (
    !body.costName ||
    body.costName.length === 0 ||
    !body.costValue ||
    Number.isNaN(body.costValue) ||
    Number.parseInt(body.costValue) < 0
  ) {
    throw createError({
      statusMessage: "Invalid value or name of the cost",
      statusCode: 404,
    });
  }

  if (
    body.isCyclic === undefined ||
    body.startMonth === undefined ||
    Number.isNaN(body.startMonth) ||
    Number.parseInt(body.startMonth) < 0 ||
    body.startYear === undefined ||
    Number.isNaN(body.startYear) ||
    Number.parseInt(body.startYear) < 0 ||
    (body.endMonth === undefined && body.endYear) ||
    (body.endMonth && !body.endYear) ||
    (body.endMonth &&
      body.endYear &&
      (Number.isNaN(body.endYear) ||
        Number.isNaN(body.endMonth) ||
        Number.parseInt(body.endMonth) < 0 ||
        Number.parseInt(body.endYear) < 0 ||
        body.isCyclic === false))
  ) {
    throw createError({
      statusMessage: "Invalid value or name of the cost",
      statusCode: 404,
    });
  }

  try {
    const createdCost = await prisma.monthlyCost.create({
      data: {
        parkingId: Number.parseInt(body.parkingId),
        costName: body.costName,
        costValue: Number.parseInt(body.costValue),
        cyclic: body.isCyclic,
        startMonth: Number.parseInt(body.startMonth),
        startYear: Number.parseInt(body.startYear),
        endMonth: Number.parseInt(body.endMonth),
        endYear: Number.parseInt(body.endYear),
      },
    });
    if (createdCost) {
      return {
        statusMessage: "Monthly cost created successfully",
      };
    } else {
      throw createError({
        statusMessage: "Error creating monthly cost",
        statusCode: 400,
      });
    }
  } catch (e) {
    throw createError({
      statusMessage: "Error creating monthly cost",
      statusCode: 400,
    });
  }
});
