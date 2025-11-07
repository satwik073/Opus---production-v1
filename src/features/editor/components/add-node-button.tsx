'use client';

import { memo, useState   } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NodeSelector } from "./node-selector";

export const AddNodeButton = memo(() => {
    const [open, setOpen] = useState(false);
    const onOpenChange = (open: boolean) => {
        setOpen(open);
    }
    return (
        <NodeSelector open={open} onOpenChange={onOpenChange}>
            <Button
                className="bg-background hover:bg-background/80 border-gray-300 border-1"
                variant="outline" size="icon">
                <PlusIcon className="size-4" />
            </Button>
        </NodeSelector>
    )
})


AddNodeButton.displayName = 'AddNodeButton';