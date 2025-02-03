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
    <Card className="sticky top-4 w-full max-w-md mx-auto lg:max-w-none">
      <CardContent className="p-4 sm:p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm sm:text-base">
              {t("stats.hourlyRate")}
            </span>
            <span className="text-lg sm:text-xl font-bold">
              {hourlyRate} MRU
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm sm:text-base">
              {t("stats.duration")}
            </span>
            <span className="font-medium text-sm sm:text-base">
              60 {t("stats.minutes")}
            </span>
          </div>
        </div>
        <BookingForm consultant={consultant} />
      </CardContent>
    </Card>
  );
}
