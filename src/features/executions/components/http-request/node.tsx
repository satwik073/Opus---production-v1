'use client';

import { NodeProps, Node, useReactFlow } from "@xyflow/react";


import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { FormType, HttpRequestDialogue } from "./dialog";

type HttpRequestNodeData = {
    endpoint?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';
    body?: string;
    [key: string]: unknown;
}

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
    const nodeData = props.data
    const [open, setOpen] = useState(false);
    const { setNodes } = useReactFlow();
    const handleSubmit = (values:
        FormType
    ) => {
        setNodes((nodes) => nodes.map((node) => {
            if (node.id === props.id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        endpoint: values.endpoint,
                        method: values.method,
                        body: values.body
                    }
                }
            }
            return node;
        }))
    }
    const description = nodeData?.endpoint ? `${nodeData.method || 'GET'} ${nodeData.endpoint}` : 'Not configured';
    const nodeStatus = 'initial'
    return (
        <>
            <BaseExecutionNode {...props} id={props.id} icon={GlobeIcon} name="HTTP Request" description={description}
                onDoubleClick={() => { setOpen(true) }}
                onSettings={() => { setOpen(true) }}
                status={nodeStatus}
            />
            <HttpRequestDialogue onSubmit={handleSubmit} defaultEndpoint={nodeData?.endpoint} defaultMethod={nodeData?.method} defaultBody={nodeData?.body} open={open} onOpenChange={setOpen} />
        </>
    )
})

HttpRequestNode.displayName = 'HttpRequestNode';
