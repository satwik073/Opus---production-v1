import RegisterProvider from "@/features/auth/RegisterProvider";
import { requireNoAuth } from "@/lib/auth-utils";

const Page = async () => {
    await requireNoAuth();
    return (
        <RegisterProvider />
    );
};

export default Page;
