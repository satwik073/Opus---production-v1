import { NodeType } from "@/generated/prisma";
import { NodeExecutor } from "./types";
import { ManualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { HttpRequestExecutor } from "@/features/executions/components/http-request/executor";

export const executorRegistry: Record<NodeType, NodeExecutor> = {
    [NodeType.HTTP_REQUEST]: HttpRequestExecutor as any,
    [NodeType.MANUAL_TRIGGER]: ManualTriggerExecutor,
    [NodeType.INITIAL]: ManualTriggerExecutor,
}

export const getExecutor = (nodeType: NodeType) : NodeExecutor=> {
    const executor = executorRegistry[nodeType];
    if (!executor) {
        throw new Error(`Executor not found for node type: ${nodeType}`);
    }
    return executor;
}