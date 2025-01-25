import { LogoutButton } from "@/components/auth/logout-button";
import LocalSwitcher from "@/components/local-switcher";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  // check if user is logged in
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <div>
      <LocalSwitcher />
      {session ? <LogoutButton /> : <p>Please login</p>}
    </div>
  );
}
