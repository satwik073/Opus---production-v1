import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { GoogleFormTriggerDialogue } from "./dialogue";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { GOOGLE_FORM_TRIGGER_CHANNEL } from "@/inngest/channels/google-form-trigger";
import { imageLinks } from "../../../../../public/logos/imagelinks";
import { fetchGoogleFormTriggerToken } from "./actions";


export const GoogleFormTriggerNode = memo((props: NodeProps) => {
    const [open, setOpen] = useState(false);
    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: GOOGLE_FORM_TRIGGER_CHANNEL,
        topic: "status",
        refreshToken: fetchGoogleFormTriggerToken,
    });
    return <>
        <BaseTriggerNode {...props} icon={imageLinks.googleform} name="Google Form" description="Runs the flow when a Google Form is submitted."
            onSettings={() => setOpen(true)}
            onDoubleClick={() => setOpen(true)}
            status={nodeStatus}
        />
        <GoogleFormTriggerDialogue open={open} onOpenChange={setOpen} />
    </>
})

GoogleFormTriggerNode.displayName = 'GoogleFormTriggerNode';