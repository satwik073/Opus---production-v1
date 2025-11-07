'use client'

import { useSuspenseWorkflow } from '@/features/workflows/hooks/use-workflows'
import { LoadingView, ErrorView } from '@/components/entity-views'
import { useState, useCallback, useMemo } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, type EdgeChange , type NodeChange, type Connection, Background, Controls, MiniMap, BackgroundVariant, Panel} from '@xyflow/react';
import { useTheme } from 'next-themes';
import '@xyflow/react/dist/style.css';
import { nodeComponents } from '@/config/node-components';
import { AddNodeButton } from './add-node-button';
import { useSetAtom } from 'jotai';
import { editorAtom } from '../store/atoms';

interface EditorProps {
    workflowId: string
}

export const EditorLoading = () => {
    return <LoadingView message="Loading editor..." />
}

export const EditorError = () => {
    return <ErrorView message="Error loading editor..." />
}

export const Editor = ({ workflowId }: EditorProps) => {
    const { data: workflow } = useSuspenseWorkflow(workflowId)
    const { theme, resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark' || theme === 'dark';
    const [nodes, setNodes] = useState(workflow.nodes);
    const [edges, setEdges] = useState(workflow.edges);
   
    const setEditor = useSetAtom(editorAtom);
    
    const onNodesChange = useCallback(
      (changes : any[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
      [],
    );
    const onEdgesChange = useCallback(
      (changes : EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
      [],
    );
    const onConnect = useCallback(
      (params : Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
      [],
    );

    // Style nodes and edges for dark mode
    const styledNodes = useMemo(() => {
        return nodes.map(node => ({
            ...node,
            style: {
                background: isDark ? 'rgb(19, 30, 46)' : 'rgb(255, 255, 255)',
                color: isDark ? 'rgb(249, 250, 251)' : 'rgb(2, 8, 23)',
                // border: '1px dashed rgb(51, 65, 85)',
                // borderRadius: '0.5rem',
                // padding: '10px',
            },
        }));
    }, [nodes, isDark]);

    const styledEdges = useMemo(() => {
        return edges.map(edge => ({
            ...edge,
            style: {
                stroke: isDark ? 'rgb(249, 249, 249)' : 'rgb(7, 7, 9)',
                // strokeWidth: 2,
                padding: 0,
            },
        }));
    }, [edges, isDark]);
    
    return (
        <div className="h-[calc(100vh-3.5rem)] w-full"> 
            <ReactFlow
                className="h-full w-full bg-background dark:bg-[rgb(2,8,23)]"
                defaultEdgeOptions={{
                    type: 'smoothstep',
                    animated: true,
                    style: {
                        stroke: isDark ? 'rgb(254, 254, 254)' : 'rgb(5, 5, 8)',
                        // strokeWidth: 2,
                    },
                }}
                nodes={styledNodes}
                edges={styledEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                onInit={setEditor}
                nodeTypes={nodeComponents}
                // snapGrid={[10, 10]}
                // snapToGrid={true}
                panOnScroll
                // panOnDrag={false}
                // selectionOnDrag
                proOptions={{
                    hideAttribution: true,
                }}
            >
                <Background 
                    variant={isDark ? BackgroundVariant.Dots : BackgroundVariant.Dots}
                    color={isDark ? 'rgb(51, 65, 85)' : 'rgb(208, 208, 208)'}
                    gap={8}
                    size={0.7}
                />
                {/* <Controls 
                    className="[&_button]:bg-black [&_button]:border-border [&_button]:text-foreground hover:[&_button]:bg-accent dark:[&_button]:bg-[rgb(30,41,59)] dark:[&_button]:border-[rgb(51,65,85)] dark:[&_button]:text-[rgb(249,250,251)] dark:hover:[&_button]:bg-[rgb(51,65,85)]"
                /> */}
                <MiniMap 
                    className="bg-black border border-border dark:bg-[rgb(30,41,59)] dark:border-[rgb(51,65,85)]"
                    nodeColor={(node) => {
                        return isDark ? 'rgb(9, 12, 31)' : 'rgb(0, 0, 0)';
                    }}
                    nodeStrokeColor={(node) => {
                        return isDark ? 'rgb(0, 0, 0)' : 'rgb(0, 0, 0)';
                    }}
                    maskColor={isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(52, 52, 52, 0.6)'}
                />
                <Panel position='top-right' className=''>
                    <AddNodeButton />
                </Panel>
            </ReactFlow> 
        </div>
    )
}