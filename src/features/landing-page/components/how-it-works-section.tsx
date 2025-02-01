"use client";

import { useTranslations } from "next-intl";
import { UserPlus, Search, CalendarClock, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface HowItWorksSectionProps {
  locale: string;
}

export function HowItWorksSection({ locale }: HowItWorksSectionProps) {
  const t = useTranslations("Landing");
  const isRtl = locale === "ar";

  const steps = [
    {
      icon: UserPlus,
      title: t("howItWorks.steps.register.title"),
      description: t("howItWorks.steps.register.description"),
    },
    {
      icon: Search,
      title: t("howItWorks.steps.choose.title"),
      description: t("howItWorks.steps.choose.description"),
    },
    {
      icon: CalendarClock,
      title: t("howItWorks.steps.book.title"),
      description: t("howItWorks.steps.book.description"),
    },
    {
      icon: Video,
      title: t("howItWorks.steps.start.title"),
      description: t("howItWorks.steps.start.description"),
    },
  ];

  return (
    <section
      id="how-it-works"
      className={cn("relative py-12 md:py-24 lg:py-32", isRtl && "text-right")}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

      <div
        className={cn(
          "mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4",
          isRtl ? "text-right" : "text-center"
        )}
      >
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t("howItWorks.title")}
        </h2>
        <p className="max-w-[85%] text-lg leading-relaxed text-muted-foreground">
          {t("howItWorks.description")}
        </p>
      </div>

      <div className="relative mx-auto max-w-5xl py-12">
        {/* Connection Line */}
        <div
          className={cn(
            "absolute left-4 top-0 h-full w-0.5 bg-primary/30 md:left-1/2 lg:block",
            isRtl && "right-4 left-auto md:right-1/2"
          )}
        />

        <div className="space-y-8 lg:space-y-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;
            const shouldReverse = isRtl ? !isEven : isEven;

            return (
              <div
                key={index}
                className={cn(
                  "relative flex flex-col gap-6 md:flex-row",
                  shouldReverse && "md:flex-row-reverse"
                )}
              >
                {/* Step Number */}
                <div
                  className={cn(
                    "absolute left-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground md:left-[calc(50%-1rem)]",
                    isRtl && "right-0 left-auto md:right-[calc(50%-1rem)]"
                  )}
                >
                  {index + 1}
                </div>

                {/* Content */}
                <div
                  className={cn(
                    "ml-12 flex-1 md:ml-0",
                    shouldReverse ? "md:text-right" : "md:text-left",
                    isRtl && "mr-12 ml-0 md:mr-0"
                  )}
                >
                  <div className="rounded-xl border bg-background/60 p-6 shadow-sm">
                    <div className={cn("mb-4", isRtl && "text-right")}>
                      <Icon
                        className="h-8 w-8 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>

                {/* Spacer for alignment */}
                <div className="hidden flex-1 md:block" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
