'use client'

import { useSuspenseWorkflow } from '@/features/workflows/hooks/use-workflows'
import { LoadingView, ErrorView } from '@/components/entity-views'

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
    return (
        <p>
            {JSON.stringify(workflow, null, 2)}
        </p>
    )
}