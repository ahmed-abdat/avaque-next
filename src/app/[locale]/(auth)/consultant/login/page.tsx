import { ConsultantLoginForm } from "@/components/auth/consultant/login-form";

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return {
    title: locale === "ar" ? "منطقة المرشد | Avaque" : "Espace guide | Avaque",
    description:
      locale === "ar"
        ? "تسجيل الدخول إلى حساب المرشد"
        : "Connectez-vous à votre compte guide",
  };
}

export default function ConsultantLoginPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return <ConsultantLoginForm locale={locale} />;
}
