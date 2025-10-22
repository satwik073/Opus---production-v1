import { TRPCClientError } from "@trpc/client";
import { useState } from "react";

import { UpgradeModal } from "@/components/upgrade-modal";


export const useUpgradeModal = () => {
    const [open, setOpen] = useState(false);

    const handleError = ( error : any)=>{
        if  ( error instanceof TRPCClientError && error.data?.code === 'FORBIDDEN' ){
            setOpen(true)
            return true
        }
        return false
    }

    const modal = <UpgradeModal open={open} onOpenChange={setOpen} />
    return {
        handleError,
        modal,
    }
}