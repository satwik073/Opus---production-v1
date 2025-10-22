import React, { Suspense } from 'react'
import { requireAuth } from '@/lib/auth-utils'
import { WorkflowsList, WorkflowsContainer } from '@/features/workflows/components/workflows';
import { prefetchWorkflows } from '@/features/workflows/server/prefetch';
import { HydrateClient } from '@/TRPC/Server';
import { ErrorBoundary } from 'react-error-boundary';

const Page = async () => {
  await requireAuth();
  prefetchWorkflows();
  return (
    <div>
      <WorkflowsContainer>
        <HydrateClient>
          <ErrorBoundary fallback={<div>Error</div>}>
            <Suspense fallback={<div>Loading...</div>}></Suspense>
            <WorkflowsList />
          </ErrorBoundary>
        </HydrateClient>
      </WorkflowsContainer>
    </div>
  )
}

export default Page