
interface DashboardPageProps {
  params: {
    locale: string;
  };
}


export default function DashboardPage({
  params: { locale },
}: DashboardPageProps) {
  return null; // The content is now handled by DashboardTabs
}
