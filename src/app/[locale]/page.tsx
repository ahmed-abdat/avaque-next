import { LogoutButton } from "@/components/auth/logout-button";
import LocalSwitcher from "@/components/local-switcher";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";

export default async function Home() {
  // check if user is logged in
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div>
      <LocalSwitcher />
      {user ? <LogoutButton /> : <p>Please login</p>}
      <p>{user?.email}</p>
      <p>{user?.user_metadata?.role}</p>
      <p>{user?.user_metadata?.full_name}</p>
      <Image src={user?.user_metadata?.avatar_url || '/logo.png'} alt="avatar" width={100} height={100} />
    </div>
  );
}
