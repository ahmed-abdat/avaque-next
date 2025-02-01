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

interface EarningsChartProps {
  data: Array<{ date: string; amount: number }>;
  isRTL: boolean;
}

export function EarningsChart({ data, isRTL }: EarningsChartProps) {
  const t = useTranslations("ConsultantDashboard");
  const { theme } = useTheme();

  const formatCurrency = (value: number) => {
    // Always use fr-MR for server/client consistency
    return `${value.toLocaleString("fr-MR")} MRU`;
  };

  // Colors based on theme
  const chartColors = {
    stroke: theme === "dark" ? "hsl(var(--primary))" : "hsl(var(--primary))",
    grid: theme === "dark" ? "hsl(var(--border))" : "hsl(var(--border))",
    area:
      theme === "dark" ? "hsl(var(--primary)/.2)" : "hsl(var(--primary)/.1)",
    areaStroke: "hsl(var(--primary))",
  };

  // Reverse data array for RTL to maintain visual consistency
  const displayData = isRTL ? [...data].reverse() : data;

  return (
    <Card className="flex w-full flex-col">
      <CardHeader className="space-y-1 px-4 sm:px-6">
        <CardTitle className="text-base sm:text-lg">
          {t("overview.charts.earnings.title")}
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          {t("overview.charts.earnings.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 px-0 pb-1 sm:px-1 sm:pb-4">
        <div className="h-[250px] w-full sm:h-[300px] md:h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={displayData}
              margin={{
                top: 5,
                right: isRTL ? 15 : 5,
                left: isRTL ? 5 : 15,
                bottom: 5,
              }}
              className={isRTL ? "rtl" : "ltr"}
            >
              <defs>
                <linearGradient id="earnings" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.grid}
                horizontal={true}
                vertical={false}
                opacity={0.5}
              />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--foreground))"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={15}
                tickFormatter={(date) =>
                  new Date(date).toLocaleDateString(isRTL ? "ar" : "fr", {
                    day: "numeric",
                  })
                }
                height={35}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="hsl(var(--foreground))"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                orientation={isRTL ? "right" : "left"}
                tickFormatter={(value) => value.toLocaleString("fr-MR")}
                width={35}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload) return null;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-md">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[0.65rem] uppercase text-muted-foreground">
                          {new Date(label).toLocaleDateString(
                            isRTL ? "ar" : "fr",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                        <span className="font-bold text-sm text-foreground">
                          {formatCurrency(payload[0].value as number)}
                        </span>
                      </div>
                    </div>
                  );
                }}
                cursor={{
                  stroke: "hsl(var(--primary))",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke={chartColors.areaStroke}
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#earnings)"
                dot={false}
                activeDot={{
                  r: 4,
                  style: { fill: "hsl(var(--primary))", opacity: 0.8 },
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
