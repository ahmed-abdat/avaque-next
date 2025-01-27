import { ForgotPasswordForm } from "@/components/auth/user/forgot-password-form";

export const metadata = {
  title: "Forgot Password | Avaque",
  description: "Reset your password",
};

export default function ForgotPasswordPage({
  params,
}: {
  params: { locale: string };
}) {
  return <ForgotPasswordForm locale={params.locale} />;
}
