"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { ConsultantWithReviews } from "../../types";
import { BookingForm } from "./booking-form";

interface BookingCardProps {
  hourlyRate: number;
  consultant: ConsultantWithReviews;
  locale: string;
}

export function BookingCard({
  hourlyRate,
  consultant,
  locale,
}: BookingCardProps) {
  const t = useTranslations("ConsultantProfile");

  return (
    <Card className="sticky top-4">
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">
              {t("stats.hourlyRate")}
            </span>
            <span className="text-xl font-bold">{hourlyRate} MRU</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">{t("stats.duration")}</span>
            <span className="font-medium">60 {t("stats.minutes")}</span>
          </div>
        </div>
        <BookingForm consultant={consultant} locale={locale} />
      </CardContent>
    </Card>
  );
}
