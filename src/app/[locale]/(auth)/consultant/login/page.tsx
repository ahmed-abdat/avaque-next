import { LoginForm } from "@/features/auth/components/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Avaque",
  description: "Login to your account",
};

export default function ConsultantLoginPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return <LoginForm locale={locale} userType="consultant" />;
}
  