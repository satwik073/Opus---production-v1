import React, { Suspense  } from 'react'
import { requireAuth } from '@/lib/auth-utils';
import { prefetchWorkflow } from '@/features/workflows/server/prefetch';
import { HydrateClient } from '@/TRPC/Server';
import { ErrorBoundary } from 'react-error-boundary';
import { EditorError, EditorLoading } from '@/features/editor/components/editor';
import { Editor } from '@/features/editor/components/editor';
import EditorHeader from '@/features/editor/components/editor-header';
interface PageProps {
    params: Promise<{
        workflowId: string
    }>
}
const Page = async ({ params }: PageProps) => {
    const { workflowId } = await params;
    await requireAuth();
    prefetchWorkflow(workflowId);
    return (
            <div className="h-screen flex flex-col overflow-hidden">
                <HydrateClient>
                    <ErrorBoundary fallback={<EditorError />}>
                        <Suspense fallback={<EditorLoading />}>
                        <EditorHeader workflowId={workflowId}/>
                        <main className="flex-1 overflow-hidden">
                            <Editor workflowId={workflowId} />
                        </main>
                        </Suspense>
                    </ErrorBoundary>
                </HydrateClient>
            </div>
    )
}

export default Page