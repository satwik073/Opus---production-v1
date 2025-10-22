import { useTRPC } from "@/TRPC/Client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useUpgradeModal } from "./use-upgrade-modal"
import { TRPCClientError } from "@trpc/client"

export const useSuspenseWorkflows = () => {
    const trpc = useTRPC()
    return useSuspenseQuery(trpc.workflows.getMany.queryOptions())
}

export const useCreateWorkflow = () => {
    const trpc = useTRPC()
    const router = useRouter()
    const queryClient = useQueryClient()
    return useMutation(trpc.workflows.create.mutationOptions({
        onSuccess: (data) => {
            toast.success(`Workflow ${data.name} created successfully`)

            queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions())
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
            queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions())

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