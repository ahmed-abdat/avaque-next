"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { CalendarDays, DollarSign, Clock } from "lucide-react";

interface StatsProps {
  totalBookings: number;
  totalEarnings: number;
  totalHours: number;
  isRTL: boolean;
}

export function ConsultantStats({
  totalBookings,
  totalEarnings,
  totalHours,
  isRTL,
}: StatsProps) {
  const t = useTranslations("ConsultantDashboard");

  const formatCurrency = (value: number) => {
    // Always use fr-MR for server/client consistency
    return `${value.toLocaleString("fr-MR")} MRU`;
  };

  const stats = [
    {
      title: t("stats.totalBookings.title"),
      value: totalBookings,
      icon: CalendarDays,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: t("stats.totalEarnings.title"),
      value: formatCurrency(totalEarnings),
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: t("stats.totalHours.title"),
      value: `${totalHours}h`,
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
  ];

  return (
    <>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className={`flex items-center gap-4 p-4`}>
            <div className="rounded-lg bg-primary/10 p-2">
              <Icon className={`h-6 w-6 text-primary`} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <h2 className="text-2xl font-bold">{stat.value}</h2>
            </div>
          </Card>
        );
      })}
    </>
  );
}
