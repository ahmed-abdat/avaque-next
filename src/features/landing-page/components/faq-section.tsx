"use client";

import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface FAQSectionProps {
  locale: string;
}

export function FAQSection({ locale }: FAQSectionProps) {
  const t = useTranslations("Landing");
  const isRtl = locale === "ar";

  const faqs = [
    {
      question: t("faq.questions.q1.question"),
      answer: t("faq.questions.q1.answer"),
    },
    {
      question: t("faq.questions.q2.question"),
      answer: t("faq.questions.q2.answer"),
    },
    {
      question: t("faq.questions.q3.question"),
      answer: t("faq.questions.q3.answer"),
    },
    {
      question: t("faq.questions.q4.question"),
      answer: t("faq.questions.q4.answer"),
    },
  ];

  return (
    <section
      id="faq"
      className={cn("relative py-12 md:py-24 lg:py-32")}
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
          {t("faq.title")}
        </h2>
        <p className="max-w-[85%] text-lg leading-relaxed text-muted-foreground">
          {t("faq.description")}
        </p>
      </div>

      <div className="mx-auto max-w-3xl py-12">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className={cn(
                "rounded-lg border bg-background/60 px-4 transition-all hover:bg-background/80"
              )}
            >
              <AccordionTrigger
                className={cn(
                  "text-left hover:no-underline",
                //   isRtl && "text-right flex-row-reverse"
                )}
              >
                <span className="text-base font-medium">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
