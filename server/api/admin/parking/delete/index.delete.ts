import { getServerSession } from "#auth";
import { PrismaClient } from "@prisma/client";
import { Role } from "@prisma/client";

export default defineEventHandler(async (event) => {
    const prisma: PrismaClient = event.context.prisma;
    const session = await getServerSession(event);
    const body = await readBody(event);

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

    try {
        let exists = await prisma.parkingSpace.findFirst({
            where: {
                parkingId: +body.parkingId,
                ocuppied: true,
            }
        });

        if (exists) {
            const upd = await prisma.parkingSpace.updateMany({
                where: {
                    parkingId: +body.parkingId,
                    ocuppied: false,
                },
                data: {
                    available: false,
                }
            });

            throw {
                statusMessage: "Unable to delete all spaces.",
                statusCode: 400,
            }
        } else {

            const spaces = await prisma.parkingSpace.deleteMany({
                where: {
                    parkingId: +body.parkingId,
                    ocuppied: false,
                },
            });

            exists = await prisma.parkingSpace.findFirst({
                where: {
                    parkingId: +body.parkingId,
                }
            });

            if (exists) {
                throw {
                    statusMessage: "Unable to delete all spaces.",
                    statusCode: 400,
                }
            }

            const chargePlan = await prisma.chargePlan.delete({
                where: {
                    parkingId: +body.parkingId,
                }
            });

            const parking = await prisma.parking.delete({
                where: {
                    id: +body.parkingId,
                }
            })

            return {
                statusMessage: "deleted successfully",
            };
        }

    } catch (e) {
        //@ts-expect-error
        console.log(e.message);
        throw e;
    }
});
