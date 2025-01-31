"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { HeroSection } from "./hero-section";
import { FeaturesSection } from "./features-section";
import { HowItWorksSection } from "./how-it-works-section";
import { TestimonialsSection } from "./testimonials-section";
import { FAQSection } from "./faq-section";
import { CTASection } from "./cta-section";
import { Header } from "../header";
import Footer from "../footer";

export function LandingPage({ locale, user }: { locale: string; user: any }) {
  const t = useTranslations("Landing");
  const isRtl = locale === "ar";
  const router = useRouter();

  // Check for returnTo URL and redirect if user is authenticated
  useEffect(() => {
    if (user) {
      const returnTo = sessionStorage.getItem("returnTo");
      console.log("returnTo", returnTo);
      console.log("user", user);
      if (returnTo) {
        sessionStorage.removeItem("returnTo"); // Clean up after getting the URL
        router.push(returnTo);
      }
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Header user={user} />
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
