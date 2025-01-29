"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CTASectionProps {
  locale: string;
}

export function CTASection({ locale }: CTASectionProps) {
  const t = useTranslations("Landing");
  const isRtl = locale === "ar";

  return (
    <section className="relative border-t">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-background" />

      <div className={cn("py-16 md:py-24 lg:py-32", isRtl && "text-right")}>
        <div
          className={cn(
            "relative mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-6",
            isRtl ? "text-right" : "text-center"
          )}
        >
          {/* Decorative elements */}
          <div className="absolute -left-12 -top-12 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />

          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {t("cta.title")}
          </h2>
          <p className="max-w-[46rem] text-lg leading-relaxed text-muted-foreground">
            {t("cta.description")}
          </p>
          <div
            className={cn(
              "flex flex-col gap-4 sm:flex-row",
              isRtl && "sm:flex-row-reverse"
            )}
          >
            <Link href={`/${locale}/register`}>
              <Button
                size="lg"
                className="min-w-[200px] bg-primary text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
                aria-label={t("cta.primaryButton")}
              >
                {t("cta.primaryButton")}
              </Button>
            </Link>
            <Link href={`/${locale}/consultants`}>
              <Button
                variant="outline"
                size="lg"
                className="min-w-[200px] border-primary/20 bg-background/60 backdrop-blur-sm transition-all hover:bg-background/80"
                aria-label={t("cta.secondaryButton")}
              >
                {t("cta.secondaryButton")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
