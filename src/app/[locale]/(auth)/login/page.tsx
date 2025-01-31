import { LoginForm } from "@/features/auth/components/login-form";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Login | Avaque",
  description: "Login to your account",
};

export default async function LoginPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { returnTo?: string };
}) {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (user && !error) {
      // If there's a returnTo parameter, redirect there instead
      const returnTo = searchParams?.returnTo;
      if (returnTo) {
        redirect(decodeURIComponent(returnTo));
      }
      // Otherwise redirect to the default locale page
      redirect(`/${locale}/`);
    }

  return <LoginForm locale={locale} userType="user" />;
}
