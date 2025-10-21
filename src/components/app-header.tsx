import React from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'

const AppHeader = () => {
    return (
        <header className='flex h-14 shrink-0 item-center gap-2 border-b py-3 px-4 dark:border-gray-800 border-gray-200'>
            <SidebarTrigger />
        </header>
    )
}

export default AppHeader