import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflows";
import { FlaskConicalIcon, Loader2 } from "lucide-react";

interface EditorWorkflowButtonProps {
    workflowId: string;
    onExecuteSuccess?: () => void;
}

export const EditorWorkflowButton = ({ workflowId, onExecuteSuccess }: EditorWorkflowButtonProps) => {

    const executeWorkflow = useExecuteWorkflow();

    const handleExecuteWorkflow = () => {
        executeWorkflow.mutate(
            { id: workflowId },
            {
                onSuccess: () => {
                    onExecuteSuccess?.();
                }
            }
        );
    }
    return (
        <Button variant="default" className="cursor-pointer w-full px-4 mr-4" onClick={handleExecuteWorkflow} size="icon" disabled={executeWorkflow.isPending}>
            {executeWorkflow.isPending ? <Loader2 className="size-4 animate-spin" /> : <FlaskConicalIcon className="size-4" />} 
            Execute workflow
        </Button>
    )
}