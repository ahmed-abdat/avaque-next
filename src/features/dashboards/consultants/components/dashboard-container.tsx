import { DashboardTabs } from "./dashboard-tabs";
import { WelcomeHeader } from "./welcome-header";
import { ConsultantProfile } from "@/types/dashboard";
import { ConsultationRequest } from "../types";

interface DashboardContainerProps {
  stats: {
    totalBookings: number;
    totalEarnings: number;
    totalHours: number;
  };
  earningsData: Array<{ date: string; amount: number }>;
  requests: ConsultationRequest[];
  profileData: ConsultantProfile | null;
  locale: string;
}

export function DashboardContainer({
  stats,
  earningsData,
  requests,
  profileData,
  locale,
}: DashboardContainerProps) {
  const isRTL = locale === "ar";

  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1">
        <div className="space-y-6 p-4 md:p-8 pt-6">
          <WelcomeHeader profileData={profileData} isRTL={isRTL} />
          <DashboardTabs
            earningsData={earningsData}
            requests={requests}
            profileData={profileData}
            locale={locale}
            stats={stats}
            isRTL={isRTL}
          />
        </div>
      </main>
    </div>
  );
}
