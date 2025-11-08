import { prisma } from "@/lib/database-setup";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { NonRetriableError } from "inngest";
import { topologicalSort } from "./utils";
import { NodeType } from "@/generated/prisma";
import { getExecutor } from "@/features/executions/lib/executor-registry";

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});


export const executeWorkflow = inngest.createFunction(
    {
        id: "execute-workflow",
    },
    {
        event: "workflows/execute.workflow",
    },
    async ({ event, step }) => {
        const workflowId = event.data.workflowId;
        if (!workflowId) {
            throw new NonRetriableError("Workflow ID is missing");

        }
        const sortedNodes = await step.run("prepare-workflow", async () => {
            const workflow = await prisma.workflow.findUniqueOrThrow({
                where: {
                    id: workflowId,
                },
                include: {
                    nodes: true,
                    connections: true,
                }
            });
            return topologicalSort(workflow.nodes, workflow.connections);
        })

        let context = event.data.initialData || {};

        for (const node of sortedNodes) {

            const executor = getExecutor(node.type as NodeType);
            context = await executor({
                data : node.data as Record<string, unknown>, 
                nodeId : node.id,
                context,
                step
            });
        }
        return { 
            workflowId,
            result : context,
         };
    })