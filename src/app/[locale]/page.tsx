import { LogoutButton } from "@/components/auth/logout-button";
import LocalSwitcher from "@/components/local-switcher";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";

export default async function Home() {
  // check if user is logged in
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <div>
      <LocalSwitcher />
      {session ? <LogoutButton /> : <p>Please login</p>}
      <p>{session?.user?.email}</p>
      <p>{session?.user?.user_metadata?.role}</p>
      <p>{session?.user?.user_metadata?.full_name}</p>
      <Image src={session?.user?.user_metadata?.avatar_url || '/logo.png'} alt="avatar" width={100} height={100} />
    </div>
  );
}
