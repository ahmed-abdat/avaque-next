import { Header } from "@/components/header";
import { getUser } from "../actions/auth";
import { getConsultantProfile } from "../actions/consultant";
import { redirect } from "next/navigation";
import { PendingApproval } from "./_components/pending-approval";

export default async function DashboardLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const user = await getUser();

  // If no user or not a consultant, redirect to home
  if (!user || user.role !== "consultant") {
    redirect(`/${locale}`);
  }

  // Get consultant profile data
  const profile = await getConsultantProfile();

  if (!profile) {
    redirect(`/${locale}`);
  }

  // If not approved, show pending message
  if (!profile.is_approved) {
    return <PendingApproval profile={profile} locale={locale} />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={profile} isDashboard={true} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
