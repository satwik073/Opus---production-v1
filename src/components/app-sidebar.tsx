"use client"


import React from "react"
import {
    CreditCardIcon,
    FolderOpenIcon,
    HistoryIcon,
    KeyIcon,
    LogOutIcon,
    StarIcon,
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

const sidebar_menu_items = [
    {
        title: "Workflows",
        items: [
            {
                title: "Workflows",
                icon: FolderOpenIcon,
                url: "/workflows",
            },
            {
                title: "Credentials",
                icon: KeyIcon,
                url: "/credentials",
            },
            {
                title: "Executions",
                icon: HistoryIcon,
                url: "/executions",
            },
        ],
    },
]
const AppSidebar = () => {
    const router = useRouter()
    const pathname = usePathname()
    const isActive = (url: string) => pathname === url
    return (
        <Sidebar collapsible="icon" className="border-0">
            <SidebarHeader>
                <SidebarMenuItem className="h-20">
                    <SidebarMenuButton asChild className="h-20">
                        <Link href="/workflows" prefetch>
                            <Image src={imageLinks.flowBolt} alt="GitHub" width={50} height={40} />
                            <span className="truncate">Opus</span>

                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>


            </SidebarHeader>
            <SidebarContent className="border-0">
                {sidebar_menu_items.map((group_items) => (
                    <SidebarGroup key={group_items.title}>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group_items.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton tooltip={item.title} isActive={(item.url === '/' ? pathname === '/' : pathname.startsWith(item.url))} asChild className="gap-x-4 h-10 px-4">
                                            <Link href={item.url} prefetch={true}>
                                                <item.icon className="size-4" />
                                                <span className="truncate">{item.title}</span>
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
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Upgrade to Pro"
                            isActive={false}
                            onClick={() => {
                                router.push('/billing')
                            }}
                            className="gap-x-4 h-10 px-4">
                            <StarIcon className="size-4" />
                            <span className="truncate">Upgrade to Pro</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
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