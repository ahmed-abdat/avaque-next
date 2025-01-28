import { GlobalHeader } from "./global-header";
import { DashboardTabs } from "./dashboard-tabs";
import { WelcomeHeader } from "./welcome-header";
import { ConsultantProfile } from "@/types/dashboard";
import { ConsultationRequest } from "../types";

interface DashboardLayoutProps {
  stats: {
    totalBookings: number;
    totalEarnings: number;
    totalHours: number;
    activeRequests: number;
  };
  earningsData: Array<{ date: string; amount: number }>;
  requests: ConsultationRequest[];
  profileData: ConsultantProfile | null;
  locale: string;
}

export default function DashboardLayout({
  stats,
  earningsData,
  requests,
  profileData,
  locale,
}: DashboardLayoutProps) {
  const isRTL = locale === "ar";

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader profileData={profileData} isRTL={isRTL} />
      <main className="flex-1">
        <div className="container space-y-6 p-4 md:p-8 pt-6">
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
