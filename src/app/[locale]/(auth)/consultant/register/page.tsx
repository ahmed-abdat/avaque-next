import { RegisterForm } from "@/features/auth/components/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Avaque",
  description: "Register to your account",
};

export default function ConsultantRegisterPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return <RegisterForm locale={locale} userType="consultant" />;
}
