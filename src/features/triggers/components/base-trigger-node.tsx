'use client';

import { type NodeProps, Position } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, type ReactNode, useCallback } from "react";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { BaseHandle } from "../../../components/react-flow/base-handle";
import { WorkflowNode } from "../../../components/workflow-node";
import { Icon } from "@radix-ui/react-select";

interface BaseTriggerNodeProps extends NodeProps {
    icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: ReactNode;
    onDoubleClick?: () => void;
    onSettings?: () => void;
    //    status? : NodeStatus;
}

export const BaseTriggerNode = memo(({ id , icon: Icon, name, description, children, onDoubleClick, onSettings }: BaseTriggerNodeProps) => {
    const handleDelete = () => { }
    return (
        <WorkflowNode onDelete={handleDelete} onSettings={onSettings} showToolbar name={name} description={description}>
            <BaseNode className="rounded-l-2xl relative group" onDoubleClick={onDoubleClick}>
                <BaseNodeContent>
                    {typeof Icon === 'string' ? (
                        <Image src={Icon} alt={name} width={16} height={16} />
                    ) : (
                        <Icon className="size-4 text-muted-foreground" />
                    )}
                    {children}
                    <BaseHandle id="source-1" type='source' position={Position.Right} />
                </BaseNodeContent>
            </BaseNode>
        </WorkflowNode>
    )
})

BaseTriggerNode.displayName = 'BaseTriggerNode';