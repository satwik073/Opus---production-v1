import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialogue } from "./dialogue";


export const ManualTriggerNode = memo((props: NodeProps) => {
    const [open, setOpen] = useState(false);
    const nodeStatus = 'initial'
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