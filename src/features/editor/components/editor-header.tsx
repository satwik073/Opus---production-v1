'use client'
import React, { useEffect, useRef, useState } from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, SaveIcon } from 'lucide-react'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useSuspenseWorkflow, useUpdateWorkflowname } from '@/features/workflows/hooks/use-workflows'
import { toast } from 'sonner'


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
    return (
        <div className="ml-auto">
            <Button variant="default" size="sm" disabled={false}>
                <ArrowUpRight className="size-4" />
                Publish
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
        <BreadcrumbItem onClick={() => setIsEditing(true)} className='cursor-pointer hover:text-for
       transition-colors duration-100'>
            {isEditing ? (
                <Input type="text" ref={inputRef} value={name} onBlur={handleSave} onChange={(e) => setName(e.target.value)} onKeyDown={handleKeyDown} className='h-7 w-auto min-w-[100px]px-2' />
            ) : (
                <span onClick={() => setIsEditing(true)}>{workflow.name}</span>
            )}
        </BreadcrumbItem>
    )
}
const EditorHeader = ({ workflowId }: { workflowId: string }) => {
    return (
        <header className='flex bg-white dark:bg-[#14181c] h-14 shrink-0 item-center gap-2 border-b py-3 px-4 dark:border-gray-800 border-gray-200'>
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