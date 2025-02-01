"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConsultationRequests } from "./consultation-requests";
import { ConsultantProfileForm } from "./profile-form";
import { Overview } from "./overview";
import { IconChartBar, IconUsers, IconSettings } from "@tabler/icons-react";
import { ConsultantProfile } from "@/types/dashboard";
import { ConsultationRequest } from "../type";

interface DashboardTabsProps {
  earningsData: Array<{ date: string; amount: number }>;
  requests: ConsultationRequest[];
  profileData: ConsultantProfile | null;
  locale: string;
  stats: {
    totalBookings: number;
    totalEarnings: number;
    totalHours: number;
  };
  isRTL: boolean;
}

export function DashboardTabs({
  earningsData,
  requests,
  profileData,
  stats,
  isRTL,
}: DashboardTabsProps) {
  const t = useTranslations("ConsultantDashboard");
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Tabs
      defaultValue={activeTab}
      onValueChange={setActiveTab}
      className="h-full space-y-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="overview"
            className="flex items-center justify-center gap-2"
          >
            <IconChartBar className="h-4 w-4" />
            <span className="hidden sm:inline-block">
              {t("navigation.overview")}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="requests"
            className="flex items-center justify-center gap-2"
          >
            <IconUsers className="h-4 w-4" />
            <span className="hidden sm:inline-block">
              {t("navigation.requests")}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="flex items-center justify-center gap-2"
          >
            <IconSettings className="h-4 w-4" />
            <span className="hidden sm:inline-block">
              {t("navigation.profile")}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Overview stats={stats} earningsData={earningsData} isRTL={isRTL} />
        </TabsContent>

        <TabsContent value="requests">
          <ConsultationRequests
            requests={requests}
            onUpdateStatus={async (id, status) => {
              console.log("Update status", id, status);
            }}
            isRTL={isRTL}
          />
        </TabsContent>

        <TabsContent value="profile">
          <ConsultantProfileForm
            initialData={
              profileData
                ? {
                    fullName: profileData.full_name || "",
                    bio_ar: profileData.bio_ar || "",
                    bio_fr: profileData.bio_fr || "",
                    shortDescription: profileData.short_description || "",
                    avatar_url: profileData.avatar_url || "",
                    hourlyRate: profileData.hourly_rate || 0,
                    specialization: profileData.specialization || "",
                    meetLink: profileData.meet_link || undefined,
                  }
                : undefined
            }
            isRTL={isRTL}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
}
