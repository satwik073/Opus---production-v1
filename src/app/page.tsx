import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/TRPC/Server";
import { Logout } from "./logout";

export default async function Home() {
  await requireAuth();
  const data = await caller.getUsers();

  return (
    <div>
      protected page
      {JSON.stringify(data)}
      <Logout />
    </div>
  );
}
