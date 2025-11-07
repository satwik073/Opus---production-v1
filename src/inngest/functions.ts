import { prisma } from "@/lib/database-setup";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

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
        await step.sleep("sleep-for-10-seconds", 10000);
        return {
            message: "Workflow executed successfully",
        }
    }
)