import { createTRPCRouter, protectedProcedure } from '../initialize-trpc';
import { prisma } from '@/lib/database-setup';
export const appRouter = createTRPCRouter({
   getUsers: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.user.findMany({
        where: {
            id: ctx.auth.user.id,
        },
    });
   }),
});
// export type definition of API
export type AppRouter = typeof appRouter;   