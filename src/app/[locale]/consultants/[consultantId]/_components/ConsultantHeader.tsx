"use client";

import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, GraduationCap, Users } from "lucide-react";
import { ConsultantWithReviews } from "../../types";

interface UserProfile {
  name: string;
  avatarUrl: string | null;
}

interface ConsultantHeaderProps {
  consultant: ConsultantWithReviews;
  averageRating: number;
  totalReviews: number;
  userProfiles: Map<string, UserProfile>;
}

export function ConsultantHeader({
  consultant,
  averageRating,
  totalReviews,
  userProfiles,
}: ConsultantHeaderProps) {
  const t = useTranslations("ConsultantProfile");
  const totalSessions = userProfiles.size; // Using userProfiles size as total sessions

  return (
    <div className="flex items-start gap-6">
      <Avatar className="h-24 w-24 border-2 border-primary/20">
        <AvatarImage src={consultant.avatar_url || ""} />
        <AvatarFallback>{consultant.full_name?.[0]}</AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{consultant.full_name}</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <GraduationCap className="h-4 w-4" />
          <span>{consultant.specialization}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{averageRating}</span>
            <span className="text-muted-foreground">({totalReviews})</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {totalSessions} {t("sessions")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
