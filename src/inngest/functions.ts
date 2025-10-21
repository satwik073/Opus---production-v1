import { prisma } from "@/lib/database-setup";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});


export const execute_ai_method = inngest.createFunction(
    { id: "execute-ai", retries: 3 },
    { event: "execute.ai" },
    async ({ event, step }) => {
        const { steps } = await step.ai.wrap("gemini-2.5-flash",
            generateText, {
            model: google('gemini-2.5-flash'),
            system: 'You are a helpful assistant that can answer questions and help with tasks.',
            prompt: 'What is the capital of France?'
        })
        return steps;
    },
);