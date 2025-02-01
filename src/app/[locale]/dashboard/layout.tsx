import { Header } from "@/components/header";
import { getUser } from "@/app/[locale]/actions";
import { redirect } from "next/navigation";
import { PendingApproval } from "@/features/dashboards/consultants/components/pending-approval";



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


  // If not approved, show pending message
  if (!user.is_approved) {
    return <PendingApproval profile={user} locale={locale} />;
  }


  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} isDashboard={true} />
      <main className="flex-1">{children}</main>
    </div>

  );
}
