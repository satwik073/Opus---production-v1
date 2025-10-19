import RegisterProvider from "@/features/auth/RegisterProvider";
import Image from "next/image";
import { requireNoAuth } from "@/lib/auth-utils";

const Page = async () => {
    await requireNoAuth();
    return (
        <div className='flex flex-col w-full items-center justify-center h-screen'>
            <Image src="/flowB.png" alt="Opus" width={100} height={100} className='w-10 h-10' />
            <RegisterProvider />
        </div>
    );
};

export default Page;
