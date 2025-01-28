"use client";

import { useTranslations } from "next-intl";
import { ConsultantProfile } from "@/types/dashboard";
import { IconStars } from "@tabler/icons-react";
import { MeetingLinkDialog } from "./meeting-link-dialog";

interface WelcomeHeaderProps {
  profileData: ConsultantProfile | null;
  isRTL: boolean;
}

export function WelcomeHeader({ profileData, isRTL }: WelcomeHeaderProps) {
  const t = useTranslations("ConsultantDashboard");

  return (
    <div className="relative overflow-hidden rounded-lg border bg-gradient-to-br from-violet-500/5 via-transparent to-violet-500/5">
      {/* Gradient Orbs */}
      <div className="absolute -left-4 -top-24 h-[200px] w-[300px] rotate-12 bg-gradient-to-br from-violet-500/20 to-transparent blur-3xl" />
      <div className="absolute -right-4 -top-24 h-[200px] w-[300px] rotate-12 bg-gradient-to-bl from-violet-500/20 to-transparent blur-3xl" />

      <div className="relative px-4 py-6 sm:px-6 sm:py-8">
        <div
          className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
        >
          {/* Welcome Text */}
          <div className={`space-y-1`}>
            <div
              className={`flex items-center gap-2 `}
            >
              <IconStars className="h-5 w-5 sm:h-6 sm:w-6 text-violet-500 shrink-0" />
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight truncate">
                {t("welcome.title")}{" "}
                <span className="text-violet-500">
                  {profileData?.full_name || profileData?.email.split("@")[0] || ""}
                </span>
              </h1>
            </div>
            <p className="text-sm text-muted-foreground max-w-[90%]">
              {t("welcome.back")}
            </p>
          </div>

          {/* Meeting Link */}
            <MeetingLinkDialog
              currentLink={profileData?.meet_link || undefined}
              isRTL={isRTL}
            />
        </div>

        {/* Optional: Additional Info or Quick Stats */}
        <div
          className={`mt-4 hidden sm:flex items-center gap-6 text-sm text-muted-foreground `}
        >
          <div
            className={`flex items-center gap-2 `}
          >
            <span>{t("welcome.specialization")}:</span>
            <span className="font-medium text-foreground">
              {profileData?.specialization || "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
