"use client"
import React from 'react'
import { useSuspenseWorkflows } from '../hooks/use-workflows'
import { EntityContainer, EntityHeader, EntityPagination, EntitySearch } from '@/components/entity-views'
import { useCreateWorkflow } from '../hooks/use-workflows'
import { toast } from 'sonner'
import { useUpgradeModal } from '../hooks/use-upgrade-modal'
import { useRouter } from 'next/navigation'
import { useWorkflowsParams } from '../hooks/use-workflows-params'
import { useEntitySearch } from '@/hooks/use-entity-search'


export const WorkflowsSearch = () => {
    const [params, setParams] = useWorkflowsParams()
    const { searchValue, onSearchChange } = useEntitySearch({ params, setParams })
    return (
        <EntitySearch value={searchValue} onChange={onSearchChange} placeholder="Search workflows" />
    )
}

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
export const WorkflowsPagination = () => {

    const workflows = useSuspenseWorkflows()
    const [params, setParams] = useWorkflowsParams()

    return (
        <EntityPagination
            page={workflows.data.page}
            totalPages={workflows.data.totalPages}
            onPageChange={(page) => setParams({ ...params, page })}
            disabled={workflows.isFetching}
        />
    )
}
export const WorkflowsContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <EntityContainer header={<WorkflowsHeader />}
            search={<WorkflowsSearch />}
            pagination={<WorkflowsPagination />}
        >
            {children}
        </EntityContainer>
    )
}