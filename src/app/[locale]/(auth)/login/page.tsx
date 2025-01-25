import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Login | Avaque",
  description: "Login to your account",
};



export default function LoginPage({ params: { locale } }: { params: { locale: string } }) {

  
  return <LoginForm locale={locale} />;
}