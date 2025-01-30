import { useTranslations } from "next-intl";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star, GraduationCap, Clock } from "lucide-react";
import { ConsultantWithReviews } from "../types";
import { cn } from "@/lib/utils";
import { HOUR_RATE } from "@/constants/hour-rate";

interface ConsultantCardProps {
  consultant: ConsultantWithReviews;
  locale: string;
  isRtl: boolean;
}

export function ConsultantCard({
  consultant,
  locale,
  isRtl,
}: ConsultantCardProps) {
  const t = useTranslations("Consultants");
  const hourlyRate = HOUR_RATE; // Default to HOUR_RATE MRU

  return (
    <Card className="group relative overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/10 transition-transform group-hover:scale-105">
            <AvatarImage
              src={consultant.avatar_url || ""}
              alt={consultant.full_name || ""}
            />
            <AvatarFallback className="bg-primary/5 text-lg">
              {consultant.full_name
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <CardTitle className={cn("text-xl", isRtl && "text-right")}>
              {consultant.full_name}
            </CardTitle>
            <div
              className={cn(
                "flex items-center gap-2",
                isRtl && "flex-row-reverse"
              )}
            >
              <GraduationCap className="h-4 w-4 text-primary" />
              <CardDescription className="font-medium">
                {consultant.specialization}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Row */}
        <div
          className={cn(
            "grid grid-cols-2 gap-4 rounded-lg border bg-muted/40 p-3",
            isRtl && "text-right"
          )}
        >
          {/* Rating */}
          <div className="space-y-1">
            <div
              className={cn(
                "flex items-center gap-1",
                isRtl && "flex-row-reverse justify-end"
              )}
            >
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="text-sm font-medium">
                {consultant.rating || 0}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {consultant.totalSessions || 0} {t("sessions")}
            </p>
          </div>
          {/* Hourly Rate */}
          <div className="space-y-1">
            <div
              className={cn(
                "flex items-center gap-1",
                isRtl && "flex-row-reverse justify-end"
              )}
            >
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{hourlyRate} MRU</span>
            </div>
            <p className="text-xs text-muted-foreground">{t("perHour")}</p>
          </div>
        </div>

        {/* Description */}
        <p
          className={cn(
            "text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]",
            isRtl && "text-right"
          )}
        >
          {consultant.short_description}
        </p>

        {/* Action Button */}
        <Link
          href={`/${locale}/consultants/${consultant.id}`}
          className="block"
        >
          <Button
            className="w-full transition-all group-hover:bg-primary group-hover:text-primary-foreground"
            variant="outline"
            size="lg"
          >
            {t("viewProfile")}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
