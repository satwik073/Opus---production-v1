import type { NodeExecutor } from "@/features/executions/lib/types";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";


type ManualTriggerData = Record<string, unknown>;

export const ManualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({ data, nodeId, context, step , publish}) => {

    await publish(manualTriggerChannel().status({
        nodeId,
        status: "loading"
    }));
    try {
        const result = await step.run("manual-trigger", async () => context);
        await publish(manualTriggerChannel().status({
            nodeId,
            status: "success"
        }));
        return result;
    } catch (error) {
        await publish(manualTriggerChannel().status({
            nodeId,
            status: "error"
        }));
        throw error;
    }
}