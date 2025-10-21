import { prisma } from "@/lib/database-setup";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
    { id: "hello-world" , retries: 3 },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        await step.sleep("wait-a-moment", "5s");
      
        await step.run("create-workflow", async () => {
            return await prisma.workflow.create({
                data: {
                    name: 'Untitled Workflow'
                }
            })
        })
    },
);