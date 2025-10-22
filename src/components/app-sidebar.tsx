"use client"


import React from "react"
import {
    BellIcon,
    CreditCardIcon,
    EclipseIcon,
    ExternalLinkIcon,
    FingerprintIcon,
    FolderKeyIcon,
    FolderOpenIcon,
    HistoryIcon,
    KeyIcon,
    LogOutIcon,
    ScanLineIcon,
    SettingsIcon,
    SplinePointerIcon,
    StarIcon,
    TouchpadIcon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar"
import { imageLinks } from "../../public/logos/imagelinks"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useHasActiveSubscription } from "@/features/auth/subscriptions/hooks/use-subscription"

const sidebar_menu_items = [
    {
        title: "Workflows",
        items: [
            {
                title: "Dashboard",
                icon: TouchpadIcon,
                url: "/workflows",
            },
            {
                title: "Appearence",
                icon: EclipseIcon,
                url: "/credentials",
            },
            {
                title: "Connections",
                icon: ScanLineIcon,
                url: "/executions",
            },
            {
                title: "Workflows",
                icon: SplinePointerIcon,
                url: "/workflows",
            },
            {
                title : 'Credentials',
                icon: FolderKeyIcon,
                url: "/credentials",
            },
            {
                title : 'Executions',
                icon : ExternalLinkIcon,
                url : '/executions',
            }
        ],
    },
]
const sidebar_menu_items2 = [
    {
        title: "Account",
        items: [
            {
                title: "Payments",
                icon: CreditCardIcon,
                url: "/credentials",
            },
            {
                title: "Security & access",
                icon: FingerprintIcon,
                url: "/executions",
            },
            {
                title: "Notifications",
                icon: BellIcon,
                url: "/executions",
            },
            {
                title: "Settings",
                icon: SettingsIcon,
                url: "/credentials",
            },
        ],
    },
]
const AppSidebar = () => {
    const router = useRouter()
    const pathname = usePathname()
    const isActive = (url: string) => pathname === url
    const { hasActiveSubscription, isLoading } = useHasActiveSubscription();
    return (
        <Sidebar collapsible="icon" className="border-0">
            <SidebarHeader>
                <SidebarMenuItem className="h-20 border-dashed border-b-1  border-gray-200 dark:border-gray-800">
                    <SidebarMenuButton asChild className="h-20">
                        <Link href="/workflows" prefetch>
                            <Image src={imageLinks.logo} alt="GitHub" className="rounded-xl w-10 h-10 gap-x-4 mr-2" width={50} height={40} />
                            <span className="truncate text-md font-bold text-black dark:text-white ">Opus Automation</span>

                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>


            </SidebarHeader>
            <SidebarContent className="border-0">
                {sidebar_menu_items.map((group_items) => (
                    <SidebarGroup key={group_items.title}>
                        <SidebarGroupContent>
                            <div className="flex uppercase flex-row px-4 pb-4 text-[10px] font-medium text-muted-foreground">
                                {group_items.title}
                            </div>
                            <SidebarMenu>
                                {group_items.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton tooltip={item.title} 
                                        // isActive={(item.url === '/' ? pathname === '/' : pathname.startsWith(item.url))}
                                         asChild className=" h-8 px-4 gap-x-4">
                                            <Link href={item.url} prefetch={true}>
                                                <item.icon style={{ fontSize: '30px' , width: '21px', height: '20px' }} className="w-24 h-24 text-gray-500 dark:text-gray-400" />
                                                <span className="truncate font-semibold text-gray-500 dark:text-gray-400 ">{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
                {sidebar_menu_items2.map((group_items) => (
                    <SidebarGroup key={group_items.title}>
                        <SidebarGroupContent>
                            <div className="flex uppercase flex-row px-4 pb-4 text-[10px] font-medium text-muted-foreground">
                                {group_items.title}
                            </div>
                            <SidebarMenu>
                                {group_items.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton tooltip={item.title} 
                                        // isActive={(item.url === '/' ? pathname === '/' : pathname.startsWith(item.url))}
                                         asChild className=" h-8 px-4 gap-x-4">
                                            <Link href={item.url} prefetch={true}>
                                                <item.icon style={{ fontSize: '30px' , width: '21px', height: '20px' }} className="w-24 h-24 text-gray-500 dark:text-gray-400" />
                                                <span className="truncate font-semibold text-gray-500 dark:text-gray-400 ">{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    {
                        !hasActiveSubscription && !isLoading && (
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    tooltip="Upgrade to Pro"
                                    isActive={false}
                                    onClick={() => {
                                        authClient.checkout({ slug: "opus-development-v1" })
                                    }}
                                    className="gap-x-4 h-10 px-4">
                                    <StarIcon className="size-4" />
                                    <span className="truncate">Upgrade to Pro</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    }
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Billing portal"
                            isActive={false}
                            onClick={() => {
                                router.push('/billing')
                            }}
                            className="gap-x-4 h-10 px-4">
                            <CreditCardIcon className="size-4" />
                            <span className="truncate">Billing portal</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Sign Out"
                            isActive={false}
                            onClick={() => {
                                authClient.signOut({
                                    fetchOptions: {
                                        onSuccess: () => {
                                            router.push('/login')
                                        },
                                        onError: (error) => {
                                            toast.error(error.error.message)
                                        }
                                    }
                                })
                            }}
                            className="gap-x-4 h-10 px-4">
                            <LogOutIcon className="size-4" />
                            <span className="truncate">Sign Out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar