import { DashboardContainer } from "./_components/dashboard-container";
import { ConsultationRequest } from "./types";
import { getConsultantProfile } from "../actions/consultant";
import { redirect } from "next/navigation";

interface DashboardPageProps {
  params: {
    locale: string;
  };
}

export default async function DashboardPage({
  params: { locale },
}: DashboardPageProps) {
  // Mock data - replace with real data fetching
  const mockStats = {
    totalBookings: 150,
    totalEarnings: 3000,
    totalHours: 75,
    activeRequests: 5,
  };

  const mockEarningsData = [
    { date: "2024-01-01", amount: 100 },
    { date: "2024-01-02", amount: 150 },
    { date: "2024-01-03", amount: 200 },
    { date: "2024-01-04", amount: 175 },
    { date: "2024-01-05", amount: 225 },
  ];

  const mockRequests: ConsultationRequest[] = [];

  const profile = await getConsultantProfile();

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
