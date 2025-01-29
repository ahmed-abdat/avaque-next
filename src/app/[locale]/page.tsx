import { LandingPage } from "@/components/landing-page";

export default function Home({ params: { locale } }: { params: { locale: string } }) {
  return <LandingPage locale={locale} />;
}
