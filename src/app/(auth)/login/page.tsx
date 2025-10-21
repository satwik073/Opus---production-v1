import LoginProvider from "@/features/auth/LoginProvider";
import { requireNoAuth } from "@/lib/auth-utils";

const Page = async () => {
    await requireNoAuth();
    return (
            <LoginProvider />
    );
};

export default Page;
