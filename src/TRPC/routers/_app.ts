import { createTRPCRouter, protectedProcedure } from '../initialize-trpc';
import { prisma } from '@/lib/database-setup';
export const appRouter = createTRPCRouter({

    getWorkflows: protectedProcedure.query(({ ctx }) => {
        return prisma.workflow.findMany();
    }),
    createWorkflow: protectedProcedure.mutation(() => {
        return prisma.workflow.create({
            data: {
                name: 'Untitled Workflow'
            }
        });
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;   