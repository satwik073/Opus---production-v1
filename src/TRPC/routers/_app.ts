import { inngest } from '@/inngest/client';
import { createTRPCRouter, protectedProcedure } from '../initialize-trpc';
import { prisma } from '@/lib/database-setup';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
export const appRouter = createTRPCRouter({
    testAI: protectedProcedure.mutation(async ({ ctx }) => {
        await inngest.send({
            name: 'execute.ai'
        })
        return { success: true, message: 'AI executed successfully' }
    }),
    getWorkflows: protectedProcedure.query(({ ctx }) => {
        return prisma.workflow.findMany();
    }),
    createWorkflow: protectedProcedure.mutation(async () => {
        await inngest.send({
            name: 'test/hello.world',
            data: {
                email: 'test@test.com'
            }
        })
        return { success: true, message: 'Workflow created successfully' }
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;   