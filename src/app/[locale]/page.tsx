import { getUser } from "@/app/[locale]/actions";
import { Header } from "@/components/header";
import {
  CTASection,
  FAQSection,
  FeaturesSection,
  HeroSection,
  HowItWorksSection,
  TestimonialsSection,
} from "@/features/landing-page/components";
import Footer from "@/components/footer";

export default async function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const user = await getUser();
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Header user={user} />
      <main className="flex-1">
        <HeroSection locale={locale} />

        <div className="space-y-24 pb-24">
          <FeaturesSection locale={locale} />

          <div className="border-t bg-muted/40">
            <HowItWorksSection locale={locale} />
          </div>

          <TestimonialsSection locale={locale} />

          <div className="border-t bg-muted/40">
            <FAQSection locale={locale} />
          </div>
        </div>

        <CTASection locale={locale} />
      </main>
      <Footer />
    </div>
  );
}
