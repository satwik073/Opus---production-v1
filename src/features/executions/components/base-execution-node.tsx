'use client';

import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, type ReactNode, useCallback } from "react";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { BaseHandle } from "../../../components/react-flow/base-handle";
import { WorkflowNode } from "../../../components/workflow-node";
import { Icon } from "@radix-ui/react-select";
import { NodeStatus, NodeStatusIndicator } from "@/components/react-flow/node-status-indicator";

interface BaseExecutionNodeProps extends NodeProps {
    icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: ReactNode;
    onDoubleClick?: () => void;
    onSettings?: () => void;
    status?: NodeStatus;
}

export const BaseExecutionNode = memo(({ id, icon: Icon, name, description, children, onDoubleClick, onSettings, status = 'initial' }: BaseExecutionNodeProps) => {

    const { setNodes, setEdges } = useReactFlow();
    const handleDelete = () => {
        setNodes((currenNodes) => {
            const updatedNodes = currenNodes.filter((node) => node.id !== id);
            return updatedNodes;
        });
        setEdges((currentEdges) => {
            const updatedEdges = currentEdges.filter((edge) => edge.source !== id && edge.target !== id);
            return updatedEdges;
        });
    }

    return (
        <WorkflowNode onDelete={handleDelete} onSettings={onSettings} showToolbar name={name} description={description}>
            <NodeStatusIndicator status={status} variant="border" className="" >
                <BaseNode status={status} className="border-[0.5px] border-gray-300 dark:border-gray-700" onDoubleClick={onDoubleClick}>
                    <BaseNodeContent>
                        {typeof Icon === 'string' ? (
                            <Image src={Icon} alt={name} width={16} height={16} />
                        ) : (
                            <Icon className="size-4 text-muted-foreground" />
                        )}
                        {children}
                        <BaseHandle id="target-1" type='target' position={Position.Left} />
                        <BaseHandle id="source-1" type='source' position={Position.Right} />
                    </BaseNodeContent>
                </BaseNode>
            </NodeStatusIndicator>
        </WorkflowNode>
    )
})

BaseExecutionNode.displayName = 'BaseExecutionNode';