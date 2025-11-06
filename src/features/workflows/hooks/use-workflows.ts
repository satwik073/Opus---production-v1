import { useTRPC } from "@/TRPC/Client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useUpgradeModal } from "./use-upgrade-modal"
import { TRPCClientError } from "@trpc/client"
import { useWorkflowsParams } from "./use-workflows-params"

export const useSuspenseWorkflows = () => {
    const trpc = useTRPC()
    const [params] = useWorkflowsParams()
    return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params))
}

export const useCreateWorkflow = () => {
    const trpc = useTRPC()
    const router = useRouter()
    const queryClient = useQueryClient()
    return useMutation(trpc.workflows.create.mutationOptions({
        onSuccess: (data) => {
            toast.success(`Workflow ${data.name} created successfully`)

            queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))
        },
        onError: (error : any) => {
            console.error('Failed to create workflow', error.message)
        }
    }))
}

export const useCreateWorkflowWithModal = () => {
    const trpc = useTRPC()
    const router = useRouter()
    const queryClient = useQueryClient()
    const { handleError, modal } = useUpgradeModal()
    
    const mutation = useMutation(trpc.workflows.create.mutationOptions({
        onSuccess: (data) => {
            toast.success(`Workflow ${data.name} created successfully`)
            queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))

        },
        onError: (error: any) => {
            if (error instanceof TRPCClientError && error.data?.code === 'FORBIDDEN') {
                handleError(error)
            } else {
                console.error('Failed to create workflow', error.message)
            }
        }
    }))

    return {
        ...mutation,
        modal
    }
}

export const useRemoveWorkflow = () => {
    const trpc = useTRPC()
    const queryClient = useQueryClient()
    const router = useRouter()
    return useMutation(trpc.workflows.remove.mutationOptions({
        onSuccess: (data) => {
            toast.success(`Workflow removed successfully ${data.name}`)
            // Remove the deleted workflow's query from cache instead of invalidating (to avoid refetch errors)
            // queryClient.removeQueries(trpc.workflows.getOne.queryFilter({ id: data.id }))
            // Invalidate all workflows list queries to refetch (regardless of current params)
            queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))
            // Navigate away from the deleted workflow's detail page if user is viewing it
            if (typeof window !== 'undefined' && window.location.pathname.includes(`/workflows/${data.id}`)) {
                router.push('/workflows')
            }
        },
        onError: (error: any, variables) => {
            console.error('Failed to remove workflow', error)
            // Handle different error types
            if (error instanceof TRPCClientError) {
                if (error.data?.code === 'UNAUTHORIZED') {
                    toast.error('You are not authorized to delete this workflow')
                } else if (error.data?.code === 'NOT_FOUND') {
                    toast.error('Workflow not found or you do not have permission to delete it')
                    // Remove the non-existent workflow from cache to prevent errors
                    if (variables?.id) {
                        queryClient.removeQueries(trpc.workflows.getOne.queryFilter({ id: variables.id }))
                    }
                } else {
                    toast.error(error.message || 'Failed to remove workflow')
                }
            } else {
                toast.error('Failed to remove workflow')
            }
            // Don't invalidate queries on error to prevent "error loading workflow"
        }
    }))
}

export const useSuspenseWorkflow = (id: string) => {
    const trpc = useTRPC()
    return useSuspenseQuery(trpc.workflows.getOne.queryOptions({ id }))
}

export const useUpdateWorkflowname = () => {
    const trpc = useTRPC()
    const router = useRouter()
    const queryClient = useQueryClient()
    return useMutation(trpc.workflows.updateName.mutationOptions({
        onSuccess: (data) => {
            toast.success(`Workflow ${data.name} updated successfully`)

            queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))
            queryClient.invalidateQueries(trpc.workflows.getOne.queryOptions({ id: data.id }))  // individual workflow query will get refetced
        },
        onError: (error : any) => {
            console.error('Failed to update workflow name', error.message)
        }
    }))
}