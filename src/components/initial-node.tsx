'use client';

import { type NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";

import { PlaceholderNode } from "@/components/react-flow/placeholder-node";
import { WorkflowNode } from "./workflow-node";
import { NodeSelector } from "@/features/editor/components/node-selector";

export const InitialNode = memo((props: NodeProps) => {
    const [open, setOpen] = useState(false);
    const onOpenChange = (open: boolean) => {
        setOpen(open);
    }
    return (
        <NodeSelector open={open} onOpenChange={onOpenChange}>
            <WorkflowNode showToolbar name="Initial" description="This is the initial node">
                <PlaceholderNode {...props} onClick={() => setOpen(true)}>
                    <div className="flex items-center justify-center cursor-pointer">
                        <PlusIcon className="size-2" />
                        {/* <span className="text-[12px] font-medium">Add node</span> */}
                    </div>
                </PlaceholderNode>
            </WorkflowNode>
        </NodeSelector>
    )
});

InitialNode.displayName = "InitialNode";