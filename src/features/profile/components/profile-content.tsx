"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, CreditCard, Calendar } from "lucide-react";
import { PersonalInfoTab } from "./personal-info-tab";
import { BookingsTab } from "./bookings-tab";
import { PaymentsTab } from "./payments-tab";
import type { UserType } from "@/types/userType";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface ProfileContentProps {
  user: UserType;
  locale: string;
}

export function ProfileContent({ user, locale }: ProfileContentProps) {
  const t = useTranslations("Profile");
  const isRtl = locale === "ar";

  return (
    <main className="flex-1 space-y-8 p-4 md:p-8 pt-4">
      {/* Profile Header */}
      <div className="p-4">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {t("title")}
        </h1>
        {/* <p className="text-muted-foreground">{t("description")}</p> */}
      </div>

      {/* Tabs Section */}
      <Tabs
        defaultValue="personal-info"
        className="p-4"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="sticky top-0 z-30 -mx-4 bg-gradient-to-b from-background/95 to-background/90 px-4 py-4 backdrop-blur-sm supports-[backdrop-filter]:from-background/60 supports-[backdrop-filter]:to-background/50">
          <TabsList className="relative w-full grid grid-cols-3 lg:w-auto gap-4 rounded-xl bg-muted/50 p-1.5">
            <TabsTrigger
              value="personal-info"
              className={cn(
                "relative",
                "group",
                "flex items-center justify-center gap-2",
                "rounded-lg px-4 py-2",
                "text-sm font-medium",
                "transition-all duration-300 ease-in-out",
                "hover:bg-background/80 hover:text-primary",
                "data-[state=active]:bg-background",
                "data-[state=active]:text-primary",
                "data-[state=active]:shadow-sm",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                isRtl && "space-x-reverse"
              )}
            >
              <Settings className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span className="hidden sm:inline">{t("tabs.personalInfo")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="bookings"
              className={cn(
                "relative",
                "group",
                "flex items-center justify-center gap-2",
                "rounded-lg px-4 py-2",
                "text-sm font-medium",
                "transition-all duration-300 ease-in-out",
                "hover:bg-background/80 hover:text-primary",
                "data-[state=active]:bg-background",
                "data-[state=active]:text-primary",
                "data-[state=active]:shadow-sm",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                isRtl && "space-x-reverse"
              )}
            >
              <Calendar className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span className="hidden sm:inline">{t("tabs.bookings")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className={cn(
                "relative",
                "group",
                "flex items-center justify-center gap-2",
                "rounded-lg px-4 py-2",
                "text-sm font-medium",
                "transition-all duration-300 ease-in-out",
                "hover:bg-background/80 hover:text-primary",
                "data-[state=active]:bg-background",
                "data-[state=active]:text-primary",
                "data-[state=active]:shadow-sm",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                isRtl && "space-x-reverse"
              )}
            >
              <CreditCard className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span className="hidden sm:inline">{t("tabs.payments")}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Personal Info Tab */}
        <TabsContent value="personal-info" className="space-y-6">
          <PersonalInfoTab user={user} locale={locale} />
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-6">
          <BookingsTab user={user} locale={locale} />
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
                <PaymentsTab user={user} locale={locale} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
