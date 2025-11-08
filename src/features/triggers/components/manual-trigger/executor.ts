import type { NodeExecutor } from "@/features/executions/lib/types";


type ManualTriggerData = Record<string, unknown>;

export const ManualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({ data, nodeId, context, step }) => {
    const result = await step.run("manual-trigger", async () => context);
    return result;
}