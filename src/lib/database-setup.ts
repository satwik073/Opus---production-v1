import { PrismaClient } from "@/generated/prisma";

const global_attribiute_for_prisma = global as unknown as { prisma: PrismaClient };

export const prisma = global_attribiute_for_prisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global_attribiute_for_prisma.prisma = prisma;

export default prisma;
