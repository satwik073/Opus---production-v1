'use client';

import { createId } from '@paralleldrive/cuid2';
import { useReactFlow } from '@xyflow/react';
import { GlobeIcon, MousePointerIcon, WebhookIcon } from 'lucide-react';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTrigger } from '@/components/ui/sheet';
import { NodeType } from '@/generated/prisma';
import { Separator } from '@/components/ui/separator';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { imageLinks } from '../../../../public/logos/imagelinks';
export type NodeTypeOption = {
    type: NodeType;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }> | string;
}

const triggerNode : NodeTypeOption[] = [
    {
    type: NodeType.MANUAL_TRIGGER,
        label: 'Manual Trigger',
        description: 'Runs the flow on clicking a button. Good for getting started quickly.',
        icon: MousePointerIcon,
    },
    {
        type: NodeType.GOOGLE_FORM_TRIGGER,
        label: 'Google Form Trigger',
        description: 'Runs the flow when a Google Form is submitted.',
        icon: imageLinks.googleform,
    }
]


const executionNode : NodeTypeOption[] =[
    {
        type: NodeType.HTTP_REQUEST,
        label: 'HTTP Request',
        description: 'Makes an HTTP request to a URL. Good for making API calls.',
        icon: GlobeIcon
    }
]

interface NodeSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export const NodeSelector = ({open , onOpenChange, children}:NodeSelectorProps) => {

    const  {  setNodes, getNodes, screenToFlowPosition} = useReactFlow();

    const handleNodeSelect = useCallback((selectedNode: NodeTypeOption) =>  {
        if (selectedNode.type === NodeType.MANUAL_TRIGGER) {
          const nodes = getNodes();
          const hasManualTrigger = nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER);

          if(hasManualTrigger) {
              toast.error('You can only have one manual trigger');
              return;   
          }
        }
      setNodes ((nodes)=>{
        const hasInitialTrigger = nodes.some((node) => node.type === NodeType.INITIAL);

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const flowPosition = screenToFlowPosition({ x: centerX + (Math.random()  - 0.5) * 200 , y: centerY + (Math.random() * -0.5) * 200 }, { snapToGrid: true });

        const newNode = {
            id: createId(),
            type: selectedNode.type,
            position: flowPosition,
            data: {},
        }

        if(hasInitialTrigger) {
            return [ newNode];
        }

        return [...nodes, newNode];
      })
    }, [setNodes, screenToFlowPosition, getNodes, onOpenChange])
    return (
        <Sheet open={open} onOpenChange={onOpenChange} >
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-lg overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>What triggers this workflow?</SheetTitle>
                    <SheetDescription>
                       A Trigger is a step that starts the workflow.
                    </SheetDescription>
                </SheetHeader>
                <div >
                    {triggerNode.map((node) => {
                        const Icon = node.icon;
                        return (
                            <div key={node.type} onClick={() => handleNodeSelect(node)} className="w-full justify-start h-auto px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary transition-all duration-300">
                               <div className="flex items-center gap-6 w-full">
                                {typeof Icon === 'string' || typeof Icon === 'object' && 'src' in Icon ? (
                                    <img src={typeof Icon === 'string' ? Icon : Icon['src']} alt={node.label} className="size-6" />
                                ):(
                                    <Icon className="size-6" />
                                )}
                                <div className="flex flex-col items-start text-left">
                                    <span className="text-sm font-medium">
                                        {node.label}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {node.description}
                                    </span>
                                </div>
                               </div>
                            </div>
                        )
                    })}
                </div>
                <Separator className='mx-4' />
                <div >
                    {executionNode.map((node) => {
                        const Icon = node.icon;
                        return (
                            <div key={node.type} onClick={() => handleNodeSelect(node)} className="w-full justify-start h-auto  px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary transition-all duration-300">
                               <div className="flex items-center gap-6 w-full">
                                {typeof Icon === 'string' || typeof Icon === 'object' && 'src' in Icon ? (
                                    <img src={typeof Icon === 'string' ? Icon : Icon['src']} alt={node.label} className="size-6" />
                                ):(
                                    <Icon className="size-6" />
                                )}
                                <div className="flex flex-col items-start text-left">
                                    <span className="text-sm font-medium">
                                        {node.label}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {node.description}
                                    </span>
                                </div>
                               </div>
                            </div>
                        )
                    })}
                </div>
            </SheetContent>
        </Sheet>
    );
};