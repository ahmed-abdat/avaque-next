import { ConsultantRegisterForm } from "@/components/auth/consultant/register-form";
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
  return <ConsultantRegisterForm locale={locale} />;
}
