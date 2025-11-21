'use client';

import { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { HistoryIcon } from "lucide-react";

interface InngestRunsSheetProps {
    runId?: string;
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export const InngestRunsSheet = ({ 
    runId, 
    trigger, 
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange 
}: InngestRunsSheetProps) => {
    const [internalOpen, setInternalOpen] = useState(false);
    
    // Use controlled state if provided, otherwise use internal state
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setOpen = controlledOnOpenChange || setInternalOpen;
    
    // Use proxy route to avoid CORS issues in production
    // The proxy route will forward requests to the Inngest dev server
    const iframeUrl = runId 
        ? `/api/inngest-dev/runs/${runId}`
        : `/api/inngest-dev/runs?status=running`;

    const defaultTrigger = (
        <Button variant="outline" size="icon" className="bg-background hover:bg-background/80 border-gray-300 border-1">
            <HistoryIcon className="size-4" />
        </Button>
    );

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {trigger || defaultTrigger}
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-4xl p-0 flex flex-col">
                <SheetHeader className="px-6 pt-6 pb-4 border-b border-gray-300 dark:border-gray-700 flex-shrink-0">
                    <SheetTitle>Execution Runs History</SheetTitle>
                    <SheetDescription>
                        Viewing Latest running workflows
                    </SheetDescription>
                </SheetHeader>
                <div className="flex-1 mx-3 mr-12 min-h-0 w-full overflow-hidden">
                    <iframe
                        src={iframeUrl}
                        className="w-[calc(100%+235px)] h-full border-0 -ml-[235px]"
                        title="Inngest Runs"
                        allow="clipboard-read; clipboard-write"
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
};