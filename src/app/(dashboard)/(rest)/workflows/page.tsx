import React, { Suspense } from 'react'
import { requireAuth } from '@/lib/auth-utils'
import { WorkflowsList, WorkflowsContainer, WorkflowsLoadingView, WorkflowsErrorView } from '@/features/workflows/components/workflows';
import { prefetchWorkflows } from '@/features/workflows/server/prefetch';
import { HydrateClient } from '@/TRPC/Server';
import { ErrorBoundary } from 'react-error-boundary';
import { SearchParams } from 'next/dist/server/request/search-params';
import { workflowsParamsLoader } from '@/features/workflows/server/params-loader-entity';

type Props ={
  searchParams : Promise<SearchParams>
}
const Page = async ( {searchParams} : Props) => {
  await requireAuth();

  const params = await workflowsParamsLoader(searchParams)
  prefetchWorkflows(params);
  return (
    <div>
      <WorkflowsContainer>
        <HydrateClient>
          <ErrorBoundary fallback={<WorkflowsErrorView />}>
            <Suspense fallback={<WorkflowsLoadingView />}>
            
            </Suspense>
            <WorkflowsList />
          </ErrorBoundary>
        </HydrateClient>
      </WorkflowsContainer>
    </div>
  )
}

export default Page