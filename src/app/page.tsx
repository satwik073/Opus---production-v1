'use client';
import { Button } from "@/components/ui/button";
import { Logout } from "./logout";
import { useTRPC } from "@/TRPC/Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function Home() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useQuery(trpc.getWorkflows.queryOptions())
  const createWorkflow = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.getWorkflows.queryOptions())
      toast.success('Workflow created successfully')
    },
    onError: (error) => {
      toast.error('Failed to create workflow')
    }
  }))

  return (
    <div>
      protected page
      {JSON.stringify(data)}
      <Button disabled={createWorkflow.isPending} onClick={() => createWorkflow.mutate()}>Create Workflow</Button>
      <Logout />
    </div>
  );
}
