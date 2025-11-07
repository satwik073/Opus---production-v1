'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAtomValue } from "jotai"
import { editorAtom } from "@/features/editor/store/atoms"


interface ManualTriggerDialogueProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
export const ManualTriggerDialogue = ({ open, onOpenChange }: ManualTriggerDialogueProps) => {
    const editor = useAtomValue(editorAtom);
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manual Trigger</DialogTitle>
                    <DialogDescription>
                        Configure settings for the manual trigger.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground">Used to manually trigger the workflow, no configuration required.</p>
                </div>
            </DialogContent>
        </Dialog>
    )
}