import React from 'react'
import { requireAuth } from '@/lib/auth-utils';
interface PageProps {
    params: Promise<{
        workflowId: string
    }>
}
const Page = async ({ params }: PageProps) => {
    const { workflowId } = await params;
    await requireAuth();
    return (
        <div>Workflow ID: {workflowId}</div>
    )
}

export default Page