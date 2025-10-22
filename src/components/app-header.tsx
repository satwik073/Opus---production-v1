import React from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ModeToggle } from './mode-toggle'

const AppHeader = () => {
    return (
        <header className='flex h-14 shrink-0 item-center gap-2 border-b py-3 px-4 dark:border-gray-800 border-gray-200'>
            <SidebarTrigger />
            <ModeToggle />
        
        </header>
    )
}

export default AppHeader