"use client";

import { useTranslations } from "next-intl";
import { HeroSection } from "./hero-section";
import { FeaturesSection } from "./features-section";
import { HowItWorksSection } from "./how-it-works-section";
import { TestimonialsSection } from "./testimonials-section";
import { FAQSection } from "./faq-section";
import { CTASection } from "./cta-section";
import { Header } from "../header";
import Footer from "../footer";

export function LandingPage({ locale }: { locale: string }) {
  const t = useTranslations("Landing");
  const isRtl = locale === "ar";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection locale={locale} />

        {/* Main Content */}
        <div className="space-y-24 pb-24">
          {/* Features */}
          <FeaturesSection locale={locale} />

          {/* How it Works */}
          <div className="border-t bg-muted/40">
            <HowItWorksSection locale={locale} />
          </div>

          {/* Testimonials */}
          <TestimonialsSection locale={locale} />

          {/* FAQ */}
          <div className="border-t bg-muted/40">
            <FAQSection locale={locale} />
          </div>
        </div>

        {/* Call to Action */}
        <CTASection locale={locale} />
      </main>
      <Footer />
    </div>
  );
}
