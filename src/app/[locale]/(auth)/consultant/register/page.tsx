import { ConsultantRegisterForm } from "@/components/auth/consultant/register-form";

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return {
    title: locale === "ar" ? "كن مرشداً | Avaque" : "Devenir guide | Avaque",
    description:
      locale === "ar" ? "التسجيل كمرشد" : "S'inscrire en tant que guide",
  };
}

export default function ConsultantRegisterPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return <ConsultantRegisterForm locale={locale} />;
}
