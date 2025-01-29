import { ConsultantLoginForm } from "@/components/auth/consultant/login-form";
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
  return <ConsultantLoginForm locale={locale} />;
}
