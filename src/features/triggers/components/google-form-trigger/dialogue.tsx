'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAtomValue } from "jotai"
import { editorAtom } from "@/features/editor/store/atoms"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CopyIcon } from "lucide-react"
import { generateGoogleFormScript } from "./utils"


interface GoogleFormTriggerDialogueProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
export const GoogleFormTriggerDialogue = ({ open, onOpenChange }: GoogleFormTriggerDialogueProps) => {
    const editor = useAtomValue(editorAtom);
    const params = useParams();
    const workflowId = params.workflowId as string;

    const baseUrl = `${process.env.NEXT_PUBLIC_APP_URL}` || 'http://localhost:3000';
    const webhookUrl = `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`;

    const copyToClipboard = () => {
        try {
            navigator.clipboard.writeText(webhookUrl);
            toast.success('Webhook URL copied to clipboard');
        } catch (error) {
            toast.error('Failed to copy webhook URL');
        }
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Google Form Trigger Settings</DialogTitle>
                    <DialogDescription>
                        Use this webhook URL in your Google Form to trigger your workflow when a form is submitted.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2 ">
                        <Label htmlFor="webhook-url">Webhook URL</Label>
                        <div className="flex items-center gap-2 mt-2">
                            <Input id="webhook-url" value={webhookUrl} readOnly className="font-mono text-sm"
                            />
                            <Button type="button" size="icon" variant="outline" className="cursor-pointer" onClick={copyToClipboard}>
                                <CopyIcon className="size-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <h4 className="text-sm font-medium"> Setup Instructions:</h4>
                        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside"><li>Open your Google Form</li>
                            <li>Click on the three dots menu ( Script Editor)</li>
                            <li>Copy and paste the code snippet into the script editor</li>
                            <li>Replace WEBHOOK_URL with the webhook URL above</li>
                            <li>Save and click triggers ( Add Trigger )</li>
                            <li>Choose: From on form submit ( Save )</li>
                        </ol>
                    </div>

                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <h4 className="text-sm font-medium"> Google Form Script:</h4>
                        <Button variant="outline" className="cursor-pointer" onClick={async () => {
                            try {
                                await navigator.clipboard.writeText(generateGoogleFormScript(webhookUrl));
                                toast.success('Google Form Script copied to clipboard');
                            } catch (error) {
                                toast.error('Failed to copy Google Form Script');
                            }
                        }}>
                            <CopyIcon className="size-4" />
                            Copy Google Form Script
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            This script includes your webhook URL and will trigger the workflow when a form is submitted.
                        </p>
                        {/* <pre className="text-sm flex-wrap w-full text-muted-foreground font-mono bg-background p-4 rounded-lg">
                            <code className="whitespace-pre-wrap"> {generateGoogleFormScript(webhookUrl)} </code>
                        </pre> */}
                    </div>

                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <h4 className="text-sm font-medium">Available Variables:</h4>
                        <pre className="text-sm flex-wrap w-full text-muted-foreground font-mono bg-background p-4 rounded-lg">
                            <code className="whitespace-pre-wrap"> {JSON.stringify({
                                formId: '{{formId}}',
                                formTitle: '{{formTitle}}',
                                responseId: '{{responseId}}',
                                timestamp: '{{timestamp}}',
                                respondentEmail: '{{respondentEmail}}',
                                responses: '{{responses}}'
                            }, null, 2)} </code>
                        </pre>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    )
}


