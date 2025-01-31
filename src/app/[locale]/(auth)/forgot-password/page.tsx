import { ForgotPasswordForm } from "@/features/auth/components/shared/forgot-password-form";

export const metadata = {
  title: "Forgot Password | Avaque",
  description: "Reset your password",
};

export default function ForgotPasswordPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale;
  return <ForgotPasswordForm locale={locale} />;
}
