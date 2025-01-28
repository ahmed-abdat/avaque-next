"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";
import { ConsultantStats } from "./stats";
import { useParams } from "next/navigation";

interface OverviewProps {
  stats: {
    totalBookings: number;
    totalEarnings: number;
    totalHours: number;
    activeRequests: number;
  };
  earningsData: Array<{ date: string; amount: number }>;
  isRTL: boolean;
}

export function Overview({ stats, earningsData, isRTL }: OverviewProps) {
  const t = useTranslations("ConsultantDashboard");
  const { theme } = useTheme();
  const params = useParams();

  // Colors based on theme
  const chartColors = {
    stroke: theme === "dark" ? "#fff" : "#000",
    grid: theme === "dark" ? "#333" : "#eee",
    area:
      theme === "dark" ? "rgba(124, 58, 237, 0.5)" : "rgba(124, 58, 237, 0.2)",
    areaStroke: "#7c3aed",
  };

  // Reverse data array for RTL to maintain visual consistency
  const displayData = isRTL ? [...earningsData].reverse() : earningsData;

  return (
    <div className="container space-y-8 px-4 md:px-6 lg:px-8">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ConsultantStats {...stats} isRTL={isRTL} />
      </div>

      {/* Earnings Chart */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>{t("overview.charts.earnings.title")}</CardTitle>
          <CardDescription>
            {t("overview.charts.earnings.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[300px] md:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={displayData}
                margin={{
                  top: 20,
                  right: isRTL ? 35 : 20,
                  left: isRTL ? 20 : 35,
                  bottom: 20,
                }}
                className={isRTL ? "rtl" : "ltr"}
              >
                <defs>
                  <linearGradient id="earnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={chartColors.grid}
                  horizontal={true}
                  vertical={true}
                />
                <XAxis
                  dataKey="date"
                  stroke={chartColors.stroke}
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                  tickMargin={8}
                  tickFormatter={(date) =>
                    new Date(date).toLocaleDateString(isRTL ? "ar" : "fr", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  axisLine={{ stroke: chartColors.grid }}
                  dy={10}
                />
                <YAxis
                  stroke={chartColors.stroke}
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                  tickMargin={8}
                  orientation={isRTL ? "right" : "left"}
                  tickFormatter={(value) =>
                    isRTL
                      ? value.toLocaleString("ar-EG")
                      : value.toLocaleString("fr-FR")
                  }
                  axisLine={{ stroke: chartColors.grid }}
                  dx={isRTL ? 10 : -10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    fontSize: "12px",
                    textAlign: isRTL ? "right" : "left",
                    direction: isRTL ? "rtl" : "ltr",
                    padding: "8px 12px",
                  }}
                  labelStyle={{
                    textAlign: isRTL ? "right" : "left",
                    direction: isRTL ? "rtl" : "ltr",
                    marginBottom: "4px",
                  }}
                  labelFormatter={(date) =>
                    new Date(date).toLocaleDateString(isRTL ? "ar" : "fr", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  }
                  formatter={(value) => [
                    isRTL
                      ? value.toLocaleString("ar-EG")
                      : value.toLocaleString("fr-FR"),
                    "amount",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke={chartColors.areaStroke}
                  fillOpacity={1}
                  fill="url(#earnings)"
                  animationDuration={1000}
                  animationBegin={0}
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
