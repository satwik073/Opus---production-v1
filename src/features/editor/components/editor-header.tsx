'use client'
import React, { useEffect, useRef, useState } from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, SaveIcon } from 'lucide-react'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useSuspenseWorkflow, useUpdateWorkflow, useUpdateWorkflowname } from '@/features/workflows/hooks/use-workflows'
import { toast } from 'sonner'
import { editorAtom } from '../store/atoms'
import { useAtomValue } from 'jotai'


export const EditorBreadcrumb = ({ workflowId }: { workflowId: string }) => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link prefetch href="/workflows">Workflows</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <EditorNameInput workflowId={workflowId} />
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export const EditorSaveButton = ({ workflowId }: { workflowId: string }) => {
    const editor = useAtomValue(editorAtom);
    const  publishWorkflow = useUpdateWorkflow();

    const handlePublish = async () => {
        if (!editor) {
            toast.error('Editor not initialized')
            return
        }
       const nodes = editor.getNodes();
       const edges = editor.getEdges();
         publishWorkflow.mutate({
            id: workflowId,
            nodes, 
            edges
         })
    }
    return (
        <div className="ml-auto">
            <Button variant="default" size="sm" disabled={publishWorkflow.isPending} className="cursor-pointer" onClick={handlePublish} >
                <ArrowUpRight className="size-4" />
                Publish workflow
            </Button>
        </div>
    )
}

export const EditorNameInput = ({ workflowId }: { workflowId: string }) => {
    const { data: workflow } = useSuspenseWorkflow(workflowId)
    const updateWorkflowName = useUpdateWorkflowname()
    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState(workflow.name)
    const inputRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus()
        }
    }, [isEditing])

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus()
            inputRef.current?.select()
        }
    }, [isEditing])

    useEffect(() => {
        setName(workflow.name)
    }, [workflow.name])

    const handleSave = async () => {
        if (name.trim() === workflow.name) {
            setIsEditing(false)
            return
        }
        try {
            await updateWorkflowName.mutateAsync({ id: workflowId, name: name.trim() })
            setName(name.trim())
        } catch (error: any) {
            toast.error(error.message || 'Failed to update workflow name')
            console.error('Failed to update workflow name', error.message)
        } finally {
            setIsEditing(false)
            setName(workflow.name)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSave()
        }
        if (e.key === 'Escape') {
            setIsEditing(false)
            setName(workflow.name)
        }
    }

    return (
        <span onClick={() => setIsEditing(true)} className='cursor-pointer hover:text-foreground transition-colors duration-100 inline-flex items-center gap-1.5'>
            {isEditing ? (
                <Input type="text" ref={inputRef} value={name} onBlur={handleSave} onChange={(e) => setName(e.target.value)} onKeyDown={handleKeyDown} className='h-7 w-auto min-w-[100px] px-2' />
            ) : (
                <span onClick={() => setIsEditing(true)}>{workflow.name}</span>
            )}
        </span>
    )
}
const EditorHeader = ({ workflowId }: { workflowId: string }) => {
    return (
        <header className='flex bg-white dark:bg-[#14181c] h-14 shrink-0 items-center gap-2 border-b py-3 px-4 dark:border-gray-800 border-gray-200'>
            <SidebarTrigger />
            <div className="flex flex-row items-center justify-between gap-x-4 w-full">
                <EditorBreadcrumb workflowId={workflowId} />
                <EditorSaveButton workflowId={workflowId} />
            </div>
            <ModeToggle />
        </header>
    )
}

export default EditorHeader