"use client";

import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { CalendarDays, Clock, User2 } from "lucide-react";
import { motion } from "framer-motion";
import type { UserType } from "@/types/userType";
import { cn } from "@/lib/utils";

interface BookingsTabProps {
  user: UserType;
  locale: string;
}

export function BookingsTab({ user, locale }: BookingsTabProps) {
  const t = useTranslations("Profile.bookings");
  const isRtl = locale === "ar";

  // Placeholder data - replace with real data fetching
  const bookings = [
    {
      id: 1,
      consultantName: "Dr. John Doe",
      date: "2024-03-20",
      time: "10:00 AM",
      status: "upcoming",
    },
    {
      id: 2,
      consultantName: "Dr. Jane Smith",
      date: "2024-03-18",
      time: "2:30 PM",
      status: "completed",
    },
    // Add more bookings as needed
  ];

  return (
    <div className="space-y-6" dir={isRtl ? "rtl" : "ltr"}>
      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-semibold">{t("title")}</h3>
          <div className="flex flex-1 gap-4 sm:max-w-[300px]">
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder={t("filterByStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allBookings")}</SelectItem>
                <SelectItem value="upcoming">{t("upcoming")}</SelectItem>
                <SelectItem value="completed">{t("completed")}</SelectItem>
                <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        {bookings.map((booking, index) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <div className="border-b border-border p-4">
                <div
                  className={cn(
                    "flex items-center justify-between",
                    isRtl && "flex-row-reverse"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center gap-3",
                      isRtl && "flex-row-reverse"
                    )}
                  >
                    <User2 className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">
                      {booking.consultantName}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      booking.status === "upcoming"
                        ? "bg-primary/10 text-primary"
                        : booking.status === "completed"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {t(booking.status)}
                  </span>
                </div>
              </div>
              <div className="grid gap-4 p-4 sm:grid-cols-2">
                <div
                  className={cn(
                    "flex items-center gap-3",
                    isRtl && "flex-row-reverse"
                  )}
                >
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                  <div className={isRtl ? "text-right" : "text-left"}>
                    <p className="text-sm text-muted-foreground">{t("date")}</p>
                    <p className="font-medium">{booking.date}</p>
                  </div>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-3",
                    isRtl && "flex-row-reverse"
                  )}
                >
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div className={isRtl ? "text-right" : "text-left"}>
                    <p className="text-sm text-muted-foreground">{t("time")}</p>
                    <p className="font-medium">{booking.time}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {bookings.length === 0 && (
        <Card className="flex flex-col items-center justify-center p-8 text-center">
          <CalendarDays className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 font-semibold">{t("noBookings")}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("noBookingsDesc")}
          </p>
        </Card>
      )}
    </div>
  );
}
