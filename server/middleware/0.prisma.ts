import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | undefined;

export default eventHandler((event) => {
    if(prisma === undefined) {
        prisma = new PrismaClient()
    }

    event.context.prisma = prisma
})