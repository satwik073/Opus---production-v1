'use client';

import { type NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";

import { PlaceholderNode } from "@/components/react-flow/placeholder-node";
import { WorkflowNode } from "./workflow-node";

export const InitialNode = memo((props: NodeProps) => {
    return (
        <WorkflowNode showToolbar name="Initial" description="This is the initial node">
            <PlaceholderNode {...props} onClick={() => {}}>
                <div className="flex items-center justify-center cursor-pointer">
                    <PlusIcon className="size-2" />
                    {/* <span className="text-[12px] font-medium">Add node</span> */}
                </div>
            </PlaceholderNode>
        </WorkflowNode>
    )
});

InitialNode.displayName = "InitialNode";