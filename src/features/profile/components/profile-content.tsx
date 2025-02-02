"use client";

import { Settings, CreditCard, Calendar } from "lucide-react";
import { PersonalInfoTab } from "./personal-info-tab";
import { BookingsTab } from "./bookings-tab";
import { PaymentsTab } from "./payments-tab";
import type { UserType } from "@/types/userType";
import { useTranslations } from "next-intl";
import { CustomTabs, type TabItem } from "@/components/ui/custom-tabs";

interface ProfileContentProps {
  user: UserType;
  locale: string;
}

export function ProfileContent({ user, locale }: ProfileContentProps) {
  const t = useTranslations("Profile");
  const isRtl = locale === "ar";

  const tabs: TabItem[] = [
    {
      value: "personal-info",
      label: t("tabs.personalInfo"),
      icon: <Settings className="h-4 w-4" />,
      content: <PersonalInfoTab user={user} locale={locale} />,
      skipCard: true,
    },
    {
      value: "bookings",
      label: t("tabs.bookings"),
      icon: <Calendar className="h-4 w-4" />,
      content: <BookingsTab user={user} locale={locale} />,
    },
    {
      value: "payments",
      label: t("tabs.payments"),
      icon: <CreditCard className="h-4 w-4" />,
      content: <PaymentsTab user={user} locale={locale} />,
    },
  ];

  return (
    <main className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
      <CustomTabs
        tabs={tabs}
        defaultValue="personal-info"
        isRtl={isRtl}
        variant="card"
      />
    </main>
  );
}
