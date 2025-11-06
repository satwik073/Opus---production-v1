'use client';

import { NodeToolbar, Position } from "@xyflow/react";
import { SettingsIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ReactNode } from "react";

interface WorkflowNodeProps {
    children: ReactNode;
    showToolbar?: boolean;
    onDelete?: () => void;
    onEdit?: () => void;
    onSettings?: () => void;
    name?: string;
    description?: string;
}

export const WorkflowNode = ({ children, showToolbar = true, onDelete, onEdit, onSettings, name, description }: WorkflowNodeProps) => {
    return (
        <>
            {showToolbar && (
                <NodeToolbar position={Position.Top}>
                    <Button variant="ghost" size="icon" onClick={onSettings}>
                        <SettingsIcon className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onDelete}>
                        <TrashIcon className="size-4" />
                    </Button>
                </NodeToolbar>
            )}
            {children}
            {name && (
                <NodeToolbar position={Position.Bottom} isVisible className="max-w-[200px] text-center">
                    <p className="text-sm font-medium">{name}</p>
                    {description && (
                        <p className="text-xs text-muted-foreground truncate">{description}</p>
                    )}
                </NodeToolbar>
            )}
        </>
    )
}