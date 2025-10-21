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
      toast.success('Job queued successfully')
    },
    onError: (error) => {
      toast.error('Failed to create workflow')
    }
  }))

  const testAI = useMutation(trpc.testAI.mutationOptions({
    onSuccess: (data) => {
      toast.success('AI test successful')
    },
    onError: (error) => {
      toast.error('Failed to test AI')
    }
  }))
  return (
    <div>
      protected page
      {JSON.stringify(data)}
      <Button disabled={createWorkflow.isPending} onClick={() => createWorkflow.mutate()}>Create Workflow</Button>
      <Logout />
     
      <Button disabled={testAI.isPending} onClick={() => testAI.mutate()}>Test AI</Button>
    </div>
  );
}
