"use client"
import React from 'react'
import { useSuspenseWorkflows } from '../hooks/use-workflows'
import { EntityContainer, EntityHeader } from '@/components/entity-views'
import { useCreateWorkflow } from '../hooks/use-workflows'
import { toast } from 'sonner'
import { useUpgradeModal } from '../hooks/use-upgrade-modal'
import { useRouter } from 'next/navigation'


export const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows()
    return (
        <div className='flex-1 justify-center items-center flex'>
            {JSON.stringify(workflows.data)}
        </div>
    )
}

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {

    const createWorkflow = useCreateWorkflow()
    const router = useRouter()
    const { handleError, modal } = useUpgradeModal()

    const handleCreateWorkflow = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => {
                toast.success('Workflow created successfully')
                router.push(`/workflows/${data.id}`)
            },
            onError: (error: any) => {
               handleError(error)
            }
        })
    }
    return (
        <div>
            <EntityHeader
                title="Workflows"
                description="Create and manage your workflows"
                newButtonLabel="New Workflow" onNew={handleCreateWorkflow}
                disabled={disabled}
                isCreating={createWorkflow.isPending} />
            {modal}
        </div>
    )
}

export const WorkflowsContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <EntityContainer header={<WorkflowsHeader />}
            search={<></>}
            pagination={<></>}
        >
            {children}
        </EntityContainer>
    )
}