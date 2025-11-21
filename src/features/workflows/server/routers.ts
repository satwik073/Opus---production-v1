import { PAGINATION } from "@/config/constants"
import prisma from "@/lib/database-setup"
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/TRPC/initialize-trpc"
import { generateSlug } from "random-word-slugs"
import { z } from "zod"
import { type Node, type Edge } from "@xyflow/react"
import { TRPCError } from "@trpc/server"
import { NodeType } from "@/generated/prisma"
import { inngest } from "@/inngest/client"
import { log } from "console"
import { sendWorkflowExecutionEvent } from "@/inngest/utils"

export const workflowsRouter = createTRPCRouter({
    execute: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
        const workflow = await prisma.workflow.findUniqueOrThrow({
            where: {
                id: input.id,
                userId: ctx.auth.user.id,
            },
        })

        // console.log("Sending workflow to inngest", input.id);
        // await inngest.send({
        //     name: "workflows/execute.workflow",
        //     data: {
        //         workflowId: input.id,
                
        //     }
        // })
        await sendWorkflowExecutionEvent({
            workflowId: input.id,
           
        });
        return workflow;
    }),
    create: premiumProcedure.mutation(async ({ ctx }) => {
        return prisma.workflow.create({
            data: {
                name: generateSlug(3),
                userId: ctx.auth.user.id,
                nodes: {
                    create: {
                        name: NodeType.INITIAL,
                        type: NodeType.INITIAL,
                        position: { x: 0, y: 0 },
                    }
                }
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
    update: protectedProcedure.input(z.object({ id: z.string(), nodes: z.array(z.object({ id: z.string(), type: z.string().nullish(), position: z.object({ x: z.number(), y: z.number() }), data: z.record(z.string(), z.any()).optional() })), edges: z.array(z.object({ id: z.string(), source: z.string(), target: z.string(), sourceHandle: z.string().nullish(), targetHandle: z.string().nullish() })) })).mutation(async ({ ctx, input }) => {
        const { id, nodes, edges } = input
        const workflow = await prisma.workflow.findUniqueOrThrow({
            where: {
                id,
                userId: ctx.auth.user.id,
            },
        })
        return await prisma.$transaction(async (tx) => {
            await tx.node.deleteMany({
                where: {
                    workflowId: id,
                },
            })
            await tx.node.createMany({
                data: nodes.map((node) => ({
                    id: node.id,
                    workflowId: id,
                    name: node.type as string || "unknown",
                    type: node.type as NodeType,
                    position: node.position,
                    data: node.data || {}
                }))
            })

            await tx.connection.createMany({
                data: edges.map((edge) => ({
                    id: edge.id,
                    workflowId: id,
                    fromNodeId: edge.source,
                    toNodeId: edge.target,
                    fromOutput: edge.sourceHandle || "main",
                    toInput: edge.targetHandle || "main",
                })),
            })

            // update workflow timestamps
            await tx.workflow.update({
                where: { id },
                data: {
                    updatedAt: new Date(),
                },
            })
            return workflow;
        })
    }),
    getOne: protectedProcedure.
        input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
            const workflow = await prisma.workflow.findUniqueOrThrow({
                where: {
                    id: input.id,
                    userId: ctx.auth.user.id,
                },
                include: {
                    nodes: true,
                    connections: true,
                }
            })
            const nodes: Node[] = workflow.nodes.map((node) => ({
                id: node.id,
                type: node.type,
                position: node.position as { x: number, y: number },
                data: (node.data as Record<string, unknown>) || {},
            }))
            const edges: Edge[] = workflow.connections.map((connection) => ({
                id: connection.id,
                source: connection.fromNodeId,
                target: connection.toNodeId,
                sourceHandle: connection.fromOutput,
                targetHandle: connection.toInput,

            }))
            return {
                id: workflow.id,
                name: workflow.name,
                nodes,
                edges,
            }
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