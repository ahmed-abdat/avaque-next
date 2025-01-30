"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
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
    <main
      className="container flex-1 space-y-8 p-4 md:p-8 pt-4"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {t("title")}
        </h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </motion.div>

      {/* Tabs Section */}
      <Tabs
        defaultValue="personal-info"
        className="space-y-6"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="sticky top-0 z-30 -mx-4 bg-background/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger
              value="personal-info"
              className={cn("space-x-2", isRtl && "space-x-reverse")}
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">{t("tabs.personalInfo")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="bookings"
              className={cn("space-x-2", isRtl && "space-x-reverse")}
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">{t("tabs.bookings")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className={cn("space-x-2", isRtl && "space-x-reverse")}
            >
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">{t("tabs.payments")}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Personal Info Tab */}
        <TabsContent value="personal-info" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <PersonalInfoTab user={user} locale={locale} />
          </motion.div>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <BookingsTab user={user} locale={locale} />
          </motion.div>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <PaymentsTab user={user} locale={locale} />
          </motion.div>
        </TabsContent>
      </Tabs>
    </main>
  );
}