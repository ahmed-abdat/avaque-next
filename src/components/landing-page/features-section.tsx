"use client";

import { useTranslations } from "next-intl";
import {
  BookOpen,
  Calendar,
  Clock,
  CreditCard,
  GraduationCap,
  Languages,
  MessageSquare,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeaturesSectionProps {
  locale: string;
}

export function FeaturesSection({ locale }: FeaturesSectionProps) {
  const t = useTranslations("Landing");
  const isRtl = locale === "ar";

  const features = [
    {
      icon: GraduationCap,
      title: t("features.expertise.title"),
      description: t("features.expertise.description"),
    },
    {
      icon: Video,
      title: t("features.onlineSessions.title"),
      description: t("features.onlineSessions.description"),
    },
    {
      icon: Calendar,
      title: t("features.flexibility.title"),
      description: t("features.flexibility.description"),
    },
    {
      icon: Languages,
      title: t("features.bilingual.title"),
      description: t("features.bilingual.description"),
    },
    {
      icon: CreditCard,
      title: t("features.pricing.title"),
      description: t("features.pricing.description"),
    },
    {
      icon: MessageSquare,
      title: t("features.support.title"),
      description: t("features.support.description"),
    },
    {
      icon: BookOpen,
      title: t("features.specialization.title"),
      description: t("features.specialization.description"),
    },
    {
      icon: Clock,
      title: t("features.convenience.title"),
      description: t("features.convenience.description"),
    },
  ];

  return (
    <section
      id="features"
      className={cn(
        "relative space-y-8 py-12 md:py-24 lg:py-32",
        isRtl && "text-right"
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

      <div
        className={cn(
          "mx-auto flex max-w-[58rem] flex-col items-center space-y-4",
          isRtl ? "text-right" : "text-center"
        )}
      >
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t("features.title")}
        </h2>
        <p className="max-w-[85%] text-lg leading-relaxed text-muted-foreground">
          {t("features.description")}
        </p>
      </div>

      <div
        className={cn(
          "mx-auto grid justify-center gap-6 sm:grid-cols-2 md:max-w-[64rem] lg:grid-cols-4",
          isRtl && "lg:grid-flow-row-dense"
        )}
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className={cn(
                "group relative overflow-hidden rounded-xl border bg-background/60 p-2 transition-all hover:border-primary/50 hover:bg-background/80",
                isRtl && "text-right"
              )}
            >
              <div className="flex h-[180px] flex-col justify-between rounded-lg p-6">
                <div className={cn("relative", isRtl && "self-end")}>
                  <div
                    className={cn(
                      "absolute -left-2 -top-2 h-20 w-20 rounded-full bg-primary/10 opacity-70 transition-all group-hover:scale-125",
                      isRtl && "-right-2 -left-auto"
                    )}
                  />
                  <Icon
                    className="relative h-10 w-10 text-primary transition-transform group-hover:scale-110"
                    aria-hidden="true"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold tracking-tight">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
