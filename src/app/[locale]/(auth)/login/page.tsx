import { LoginForm } from "@/components/auth/user/login-form";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Login | Avaque",
  description: "Login to your account",
};

export default async function LoginPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (user && !error) {
      redirect(`/${locale}/`);
    }

    return <LoginForm locale={locale} />;
  } catch (error) {
    console.error("Error in login page:", error);
    return <LoginForm locale={locale} />;
  }
}
