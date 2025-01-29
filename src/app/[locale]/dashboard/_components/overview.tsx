"use client";

import { ConsultantStats } from "./stats";
import { EarningsChart } from "./earnings-chart";

interface OverviewProps {
  stats: {
    totalBookings: number;
    totalEarnings: number;
    totalHours: number;
  };
  earningsData: Array<{ date: string; amount: number }>;
  isRTL: boolean;
}

export function Overview({ stats, earningsData, isRTL }: OverviewProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
        <ConsultantStats {...stats} isRTL={isRTL} />
      </div>

      {/* Earnings Chart */}
      <div className="-mx-4 sm:mx-0">
        <EarningsChart data={earningsData} isRTL={isRTL} />
      </div>
    </div>
  );
}
