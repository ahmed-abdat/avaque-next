import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata = {
  title: "Register | Avaque",
  description: "Create your account",
};

export default function RegisterPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale;
  return <RegisterForm locale={locale} userType="user" />;
}
