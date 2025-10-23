import { AlertCircleIcon, ChevronLeftIcon, ChevronRightIcon, FileIcon, PackageOpenIcon, PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";

import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { imageLinks } from "../../public/logos/imagelinks";

type EntityHeaderProps = {
    title?: string;
    description?: string;
    newButtonLabel?: string;
    disabled?: boolean;
    isCreating?: boolean;

} & (
        | {
            onNew: () => void; newButtonHref?: never
        }
        | {
            newButtonHref: string; onNew?: never
        }
        | { onNew?: never; newButtonHref?: never }
    )

export const EntityHeader = ({ title, description, newButtonLabel, disabled, isCreating, onNew, newButtonHref }: EntityHeaderProps) => {
    return (
        <div className="flex flex-row items-center justify-between gap-x-4 w-full">
            <div className="flex flex-col">
                <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
                {description && <p className="text-xs md:text-sm text-muted-foreground">{description}</p>}
            </div>
            {onNew && !newButtonHref && (
                <Button variant="default" className="cursor-pointer h-[28px]" size="sm" onClick={onNew} disabled={disabled || isCreating}>
                    <PlusIcon
                        className="size-4" />
                    {newButtonLabel}
                </Button>
            )}
            {!onNew && newButtonHref && (
                <Button asChild className="cursor-pointer" size="sm" >
                    <Link href={newButtonHref} prefetch>
                        <PlusIcon
                            className="size-4" />
                        {newButtonLabel}
                    </Link>
                </Button>
            )}


        </div>
    )
}


type EntityContainerProps = {
    header?: React.ReactNode;
    search?: React.ReactNode;
    pagination?: React.ReactNode;
    children: React.ReactNode;
}

export const EntityContainer = ({ header, search, pagination, children }: EntityContainerProps) => {
    return (
        <div className=" md:py- h-full ">

 
            <div className="mx-auto  w-full flex flex-col  h-full">
                <div className="flex flex-row items-center justify-between">
                </div>
              
                <div className="border-b p-4 md:px-5 md:py-3 border-gray-200 dark:border-[#27282b] sticky top-0 bg-white dark:bg-[#14181c] z-10">
                {header && header}
                </div>
                <div className="flex flex-col gap-y-4 h-full">
                    {children}
                </div>
                {pagination && pagination}
            </div>
        </div>
    )
}

interface EntitySearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const EntitySearch = ({ value, onChange, placeholder = 'Search' }: EntitySearchProps) => {
    return (
        <div className="relative ml-auto">
            <SearchIcon className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input className="max-w-[200px] bg-background shadow-none border-border pl-8 h-[30px]" type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
            />
        </div>
    )
}

interface EntityPaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
}

export const EntityPagination = ({ page, totalPages, onPageChange, disabled }: EntityPaginationProps) => {
    return (
        <div className="flex items-center gap-x-2">
            <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page === 1 || disabled} className="cursor-pointer">
                <ChevronLeftIcon className="size-4" />
                Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page === totalPages || disabled} className="cursor-pointer">
                <ChevronRightIcon className="size-4" />
                Next
            </Button>
        </div>
    )
}

interface StateViewProps {
    message?: string;
}



export const LoadingView = ({ message }: StateViewProps) => {
    return (
        <div className="flex mt-12 flex-col flex-1 gap-y-4 items-center justify-center h-full">
            <Spinner className="size-4 animate-spin text-muted-foreground" />
            {message && <p className="text-sm text-muted-foreground">{message || 'Loading...'}</p>}
        </div>
    )
}

export const ErrorView = ({ message }: StateViewProps) => {
    return (
        <div className="flex flex-col flex-1 gap-y-4 items-center justify-center h-full">
            <AlertCircleIcon className="size-4 text-red-500" />
            {message && <p className="text-sm text-red-500">{message || 'Error...'}</p>}
        </div>
    )
}

interface EmptyViewProps extends StateViewProps {
 onNew?: () => void;
 entity?: string;
}


export const EmptyView = ({ message, onNew, entity = 'items' }: EmptyViewProps) => {
    return (
        <Empty className="">
         <EmptyHeader>
                <img src={imageLinks.emptyWorkflow.src} alt="Empty Workflow" width={215} height={140} />
            
         </EmptyHeader>
         <EmptyContent>
            <EmptyTitle className="text-[20px] font-medium">No {entity} found</EmptyTitle>
            <EmptyDescription className="text-[15px] max-w-[250px]">{message || 'No data...'}</EmptyDescription>
         </EmptyContent>
         {onNew && (
            <Button variant="default" size="sm" onClick={onNew} className="cursor-pointer h-[28px] text-[14px]">
                <PlusIcon className="size-4" />
                New {entity}
            </Button>
         )}
        </Empty>
    )
}