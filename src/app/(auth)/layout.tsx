import React from 'react'



const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='flex flex-col w-full items-center justify-center h-screen'>
            {/* <Image src="/flowB.png" alt="Opus" width={100} height={100} className='w-10 h-10' /> */}
            {children}
        </div>
    )
}

export default Layout