import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Register | Avaque",
  description: "Create your account",
};

export default function RegisterPage({ params }: { params: { locale: string } }) {
  return <RegisterForm locale={params.locale} />;
}
