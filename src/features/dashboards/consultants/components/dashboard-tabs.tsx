"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { IconChartBar, IconUsers, IconSettings } from "@tabler/icons-react";
import { ConsultationRequests } from "./consultation-requests";
import { ConsultantProfileForm } from "./profile-form";
import { Overview } from "./overview";
import { ConsultantProfile } from "@/types/dashboard";
import { ConsultationRequest } from "../type";
import { CustomTabs, type TabItem } from "@/components/ui/custom-tabs";

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

  const tabs: TabItem[] = [
    {
      value: "overview",
      label: t("navigation.overview"),
      icon: <IconChartBar className="h-4 w-4" />,
      content: (
        <Overview stats={stats} earningsData={earningsData} isRTL={isRTL} />
      ),
    },
    {
      value: "requests",
      label: t("navigation.requests"),
      icon: <IconUsers className="h-4 w-4" />,
      content: (
        <ConsultationRequests
          requests={requests}
          onUpdateStatus={async (id, status) => {
            console.log("Update status", id, status);
          }}
          isRTL={isRTL}
        />
      ),
    },
    {
      value: "profile",
      label: t("navigation.profile"),
      icon: <IconSettings className="h-4 w-4" />,
      content: (
        <ConsultantProfileForm
          initialData={
            profileData
              ? {
                full_name: profileData.full_name || "",
                  bio_ar: profileData.bio_ar || "",
                  bio_fr: profileData.bio_fr || "",
                  avatar_url: profileData.avatar_url || "",
                  specialization: profileData.specialization || "",
                  meetLink: profileData.meet_link || undefined,
                }
              : undefined
          }
          isRTL={isRTL}
        />
      ),
      skipCard: true,
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <CustomTabs
        tabs={tabs}
        defaultValue={activeTab}
        isRtl={isRTL}
        variant="card"
        onChange={setActiveTab}
      />
    </div>
  );
}
