"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  locale: string;
}

export function HeroSection({ locale }: HeroSectionProps) {
  const t = useTranslations("Landing");
  const isRtl = locale === "ar";

  return (
    <section className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-background" />

      <div
        className={cn(
          "relative space-y-8 px-4 py-12 md:py-24 lg:py-32",
          isRtl && "text-right"
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-[64rem] flex-col items-center gap-6",
            isRtl ? "text-right" : "text-center"
          )}
        >
          <div className="rounded-full bg-primary/10 px-4 py-1.5">
            <span className="text-sm font-medium text-primary">
              {t("hero.subtitle")}
            </span>
          </div>
          <h1 className="text-3xl text-center font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="max-w-[42rem] text-center text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
            {t("hero.description")}
          </p>
          <div
            className={cn(
              "flex w-full flex-col gap-4 sm:flex-row sm:w-auto",
              isRtl && "sm:flex-row-reverse"
            )}
          >
            <Link href={`/${locale}/register`} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto sm:min-w-[160px] shadow-lg transition-all hover:shadow-xl"
                aria-label={t("hero.cta")}
              >
                {t("hero.cta")}
              </Button>
            </Link>
            <Link href={`/${locale}/consultants`} className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto sm:min-w-[160px] border-primary/20 bg-background/60 backdrop-blur-sm transition-all hover:bg-background/80"
                aria-label={t("hero.exploreCta")}
              >
                {t("hero.exploreCta")}
              </Button>
            </Link>
          </div>
        </div>

        <div
          className={cn(
            "mx-auto grid max-w-5xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3",
            isRtl && "lg:grid-flow-row-dense"
          )}
        >
          {[
            {
              icon: GraduationCap,
              title: t("hero.features.expertise.title"),
              description: t("hero.features.expertise.description"),
            },
            {
              icon: Video,
              title: t("hero.features.onlineSessions.title"),
              description: t("hero.features.onlineSessions.description"),
            },
            {
              icon: Users,
              title: t("hero.features.community.title"),
              description: t("hero.features.community.description"),
            },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={cn(
                  "flex flex-col items-center space-y-2 rounded-xl border bg-background/60 p-6 shadow-sm backdrop-blur-sm transition-all hover:bg-background/80",
                  isRtl ? "text-right items-end" : "text-center items-center"
                )}
              >
                <div className="rounded-full bg-primary/10 p-3">
                  <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
