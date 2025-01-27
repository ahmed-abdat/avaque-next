import { VerifyEmailForm } from "@/components/auth/user/verify-email-form";

export const metadata = {
  title: "Verify Email | Avaque",
  description: "Verify your email address",
};

export default function VerifyEmailPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return <VerifyEmailForm locale={locale} />;
}
