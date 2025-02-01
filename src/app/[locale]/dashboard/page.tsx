import { DashboardContainer } from "@/features/dashboards/consultants/components/dashboard-container";
import { ConsultationRequest } from "./types";
import { redirect } from "next/navigation";
import { getUser } from "../actions";
import { mockStats, mockEarningsData } from "@/features/dashboards/consultants/mock_data";

interface DashboardPageProps {
  params: {
    locale: string;
  };
}

export default async function DashboardPage({
  params: { locale },
}: DashboardPageProps) {
  
  const mockRequests: ConsultationRequest[] = [];

  const profile = await getUser();

  // if their is no profile, redirect to the consultant login page
  if (!profile) {
    return redirect(`/${locale}/consultant/login`);
  }

  return (
    <DashboardContainer
      stats={mockStats}
      earningsData={mockEarningsData}
      requests={mockRequests}
      profileData={profile}
      locale={locale}
    />
  );
}
