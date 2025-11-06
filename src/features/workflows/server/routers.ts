import { PAGINATION } from "@/config/constants"
import prisma from "@/lib/database-setup"
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/TRPC/initialize-trpc"
import { generateSlug } from "random-word-slugs"
import { z } from "zod"
import { TRPCError } from "@trpc/server"

export const workflowsRouter = createTRPCRouter({
    create: premiumProcedure.mutation(async ({ ctx }) => {
        return prisma.workflow.create({
            data: {
                name: generateSlug(3),
                userId: ctx.auth.user.id,
            }
        })
    }),

    remove: protectedProcedure.
        input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
            // First check if the workflow exists and belongs to the user
            const workflow = await prisma.workflow.findUnique({
                where: {
                    id: input.id,
                    userId: ctx.auth.user.id,
                }
            })
            
            if (!workflow) {
                throw new TRPCError({ 
                    code: 'NOT_FOUND', 
                    message: 'Workflow not found or you do not have permission to delete it' 
                })
            }
            
            // Delete the workflow
            return prisma.workflow.delete({
                where: {
                    id: input.id,
                    userId: ctx.auth.user.id,
                }
            })
        }),

    updateName: protectedProcedure.input(z.object({ id: z.string(), name: z.string().min(1) })).mutation(async ({ ctx, input }) => {
        return prisma.workflow.update({
            where: {
                id: input.id,
                userId: ctx.auth.user.id,
            },
            data: {
                name: input.name,
            }
        })
    }),
    getOne: protectedProcedure.
        input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
            return prisma.workflow.findUnique({
                where: {
                    id: input.id,
                    userId: ctx.auth.user.id,
                }
            })
        }),
    getMany: protectedProcedure.
        input(z.object({
            page: z.number().default(PAGINATION.DEFAULT_PAGE), pageSize: z.number().min(PAGINATION.MIN_PAGE_SIZE).max(PAGINATION.MAX_PAGE_SIZE).default(PAGINATION.DEFAULT_PAGE_SIZE),
            search: z.string().default('')
        })).

        query(async ({ ctx, input }) => {
            const { page, pageSize, search } = input

            const [items, totalCount] = await Promise.all([
                prisma.workflow.findMany({
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                    where: {
                        userId: ctx.auth.user.id,
                        name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                }),
                prisma.workflow.count({
                    where: {
                        userId: ctx.auth.user.id,
                    },
                }),
            ])
            const totalPages = Math.ceil(totalCount / pageSize)
            const hasMore = page < totalPages
            const previousPage = page > 1
            return {
                items,
                page,
                pageSize,
                totalCount,
                totalPages,
                hasMore,
                previousPage,

            }
        }),

})