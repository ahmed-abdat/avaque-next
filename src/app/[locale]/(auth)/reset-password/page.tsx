import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata = {
  title: "Reset Password | Avaque",
  description: "Reset your password to access your account",
};

export default function ResetPasswordPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return <ResetPasswordForm locale={locale} />;
}
