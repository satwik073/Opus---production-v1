"use client"
import React from 'react'
import { useSuspenseWorkflows } from '../hooks/use-workflows'
import { EntityContainer, EntityHeader, EntityPagination, EntitySearch, ErrorView, EmptyView, LoadingView } from '@/components/entity-views'
import { useCreateWorkflow } from '../hooks/use-workflows'
import { toast } from 'sonner'
import { useUpgradeModal } from '../hooks/use-upgrade-modal'
import { useRouter } from 'next/navigation'
import { useWorkflowsParams } from '../hooks/use-workflows-params'
import { useEntitySearch } from '@/hooks/use-entity-search'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EyeIcon, PlayIcon, MoreHorizontalIcon, CalendarIcon, ClockIcon, ActivityIcon, CopyIcon, TrashIcon, EditIcon, SettingsIcon, ZapIcon, CheckCircleIcon, XCircleIcon, AlertCircleIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'


export const WorkflowsSearch = () => {
    const [params, setParams] = useWorkflowsParams()
    const { searchValue, onSearchChange } = useEntitySearch({ params, setParams })
    return (
        <EntitySearch value={searchValue} onChange={onSearchChange} placeholder="Search workflows" />
    )
}

export const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows()
    const router = useRouter()
    
    if (workflows.isFetching) {
        return <WorkflowsLoadingView />
    }
    
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }
    
    const formatDateTime = (dateString: string) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }
    
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <CheckCircleIcon className="w-3 h-3 text-green-500" />
            case 'inactive':
                return <XCircleIcon className="w-3 h-3 text-gray-400" />
            case 'error':
                return <AlertCircleIcon className="w-3 h-3 text-red-500" />
            default:
                return <ActivityIcon className="w-3 h-3 text-gray-400" />
        }
    }
    
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
            case 'inactive':
                return "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
            case 'error':
                return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
            default:
                return "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
        }
    }
    
    const getWorkflowInitials = (name: string) => {
        if (!name) return 'W'
        return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
    }
    
    return (
        <TooltipProvider>
            <div className="w-full">
                {workflows.data?.items?.length > 0 ? (
                    <div className="border border-gray-200 dark:border-gray-800 rounded-md bg-card overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-border hover:bg-transparent">
                                    <TableHead className="w-[350px] font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                                        Workflow
                                    </TableHead>
                                    <TableHead className="w-[120px] font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                                        Status
                                    </TableHead>
                                    <TableHead className="w-[100px] font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                                        Executions
                                    </TableHead>
                                    <TableHead className="w-[100px] font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                                        Success Rate
                                    </TableHead>
                                    <TableHead className="w-[140px] font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                                        Created
                                    </TableHead>
                                    <TableHead className="w-[140px] font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                                        Last Run
                                    </TableHead>
                                    <TableHead className="w-[120px] text-right font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {workflows.data.items.map((workflow: any, index: number) => (
                                    <TableRow 
                                        key={workflow.id} 
                                        className="cursor-pointer hover:bg-muted/30 transition-all duration-200 group border-b border-border/50 last:border-b-0"
                                        onClick={() => router.push(`/workflows/${workflow.id}`)}
                                    >
                                        <TableCell className="py-2">
                                            <div className="flex items-center space-x-4">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                        {getWorkflowInitials(workflow.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-foreground truncate">
                                                        {workflow.name || 'Untitled Workflow'}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground flex items-center space-x-2">
                                                        <span>ID: {workflow.id}</span>
                                                        {workflow.tags && workflow.tags.length > 0 && (
                                                            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                                                                {workflow.tags[0]}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                   
                                                </div>
                                                
                                            </div>
                                        </TableCell>
                                        
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                {getStatusIcon(workflow.active ? 'active' : 'inactive')}
                                                <Badge 
                                                    variant="outline"
                                                    className={`text-xs font-medium ${getStatusColor(workflow ? 'active' : 'inactive')}`}
                                                >
                                                    {workflow ? "Active" : "Inactive"}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-row items-center space-x-2">
                                                <div className="flex items-center space-x-1">
                                                    <ZapIcon className="w-3 h-3 text-muted-foreground" />
                                                    <span className="font-semibold text-sm">{workflow.executionCount || 0}</span>
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {workflow.executionCount > 0 ? 'total runs' : 'no runs yet'}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col space-y-1">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <span className="text-sm font-medium">
                                                        {workflow.successRate ? `${Math.round(workflow.successRate)}%` : 'N/A'}
                                                    </span>
                                                </div>
                                                {workflow.successRate && (
                                                    <Progress 
                                                        value={workflow.successRate} 
                                                        className="h-1.5 w-16"
                                                    />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                                <CalendarIcon className="w-3 h-3" />
                                                <span>{formatDate(workflow.createdAt)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                                <ClockIcon className="w-3 h-3" />
                                                <span>{formatDateTime(workflow.updatedAt)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end space-x-1">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 transition-opacity"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                router.push(`/workflows/${workflow.id}`)
                                                            }}
                                                        >
                                                            <EyeIcon className="h-2 w-2" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>View workflow</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                                
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0  transition-opacity"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                toast.info('Execute workflow functionality coming soon')
                                                            }}
                                                        >
                                                            <PlayIcon className="h-2 w-2" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Execute workflow</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                                
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0  transition-opacity"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <MoreHorizontalIcon className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                                            <EyeIcon className="w-3 h-3 mr-2" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                                            <EditIcon className="w-3 h-3 mr-2" />
                                                            Edit Workflow
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                                            <PlayIcon className="w-3 h-3 mr-2" />
                                                            Execute Now
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                                            <CopyIcon className="w-3 h-3 mr-2" />
                                                            Duplicate
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                                            <SettingsIcon className="w-3 h-3 mr-2" />
                                                            Settings
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem 
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="text-red-500 focus:text-destructive"
                                                        >
                                                            <TrashIcon className="w-3 h-3 mr-2 text-red-500" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <WorkflowsEmptyView />
                )}
            </div>
        </TooltipProvider>
    )
}

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {

    const createWorkflow = useCreateWorkflow()
    const router = useRouter()
    const { handleError, modal } = useUpgradeModal()

    const handleCreateWorkflow = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => {
                toast.success('Workflow created successfully')
                router.push(`/workflows/${data.id}`)
            },
            onError: (error: any) => {
                handleError(error)
            }
        })
    }
    return (
        <div className="flex flex-row items-center justify-between gap-x-4 w-full">
            <EntityHeader
                title="Workflows"
                description="Create and manage your workflows"
                newButtonLabel="New Workflow" onNew={handleCreateWorkflow}
                disabled={disabled}
                isCreating={createWorkflow.isPending} />
            {modal}
            <div className="flex flex-row items-center justify-end">
                <WorkflowsSearch />
            </div>
        </div>
    )
}
export const WorkflowsPagination = () => {

    const workflows = useSuspenseWorkflows()
    const [params, setParams] = useWorkflowsParams()

    return (
        <EntityPagination
            page={workflows.data.page}
            totalPages={workflows.data.totalPages}
            onPageChange={(page) => setParams({ ...params, page })}
            disabled={workflows.isFetching}
        />
    )
}
export const WorkflowsContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <EntityContainer header={<WorkflowsHeader />}
            search={<WorkflowsSearch />}
            pagination={<WorkflowsPagination />}
        >
            {children}
        </EntityContainer>
    )
}


export const WorkflowsLoadingView = () => {
    return (
        <LoadingView message="Loading workflows..." />
    )
}
export const WorkflowsErrorView = () => {
    return (
        <ErrorView message="Error loading workflows..." />
    )
}

export const WorkflowsEmptyView = () => {
    const createWorkflow = useCreateWorkflow()
    const router = useRouter()
    const { handleError, modal } = useUpgradeModal()

    const handleCreateWorkflow = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => {
                toast.success('Workflow created successfully')
                router.push(`/workflows/${data.id}`)
            },
            onError: (error: any) => {
                handleError(error)
            }
        })
    }
    return (
        <EmptyView message="You don't have any workflows yet. Create one to get started." onNew={handleCreateWorkflow} />
    )
}