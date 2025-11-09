import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialogue } from "./dialogue";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { MANUAL_TRIGGER_CHANNEL } from "@/inngest/channels/manual-trigger";
import { fetchManualTriggerToken } from "./actions";


export const ManualTriggerNode = memo((props: NodeProps) => {
    const [open, setOpen] = useState(false);
    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: MANUAL_TRIGGER_CHANNEL,
        topic: "status",
        refreshToken: fetchManualTriggerToken,
    });
    return <>
        <BaseTriggerNode {...props} icon={MousePointerIcon} name="When clicking 'Execute workflow'" description="Manual Trigger"
            onSettings={() => setOpen(true)}
            onDoubleClick={() => setOpen(true)}
            status={nodeStatus}
        />
        <ManualTriggerDialogue open={open} onOpenChange={setOpen} />
    </>
})

ManualTriggerNode.displayName = 'ManualTriggerNode';