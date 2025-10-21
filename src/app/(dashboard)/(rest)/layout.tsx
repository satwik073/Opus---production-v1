import AppHeader from '@/components/app-header'
import AppSidebar from '@/components/app-sidebar'
import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
    <React.Fragment>
        <AppHeader />
      <main className='flex-1'>
        {children}
        </main>  
    </React.Fragment>
    )
}

export default Layout