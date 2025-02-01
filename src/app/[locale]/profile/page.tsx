import { Header } from "@/components/header";
import { getUser } from "@/app/[locale]/actions";
import { redirect } from "next/navigation";
import { ProfileContent } from "@/features/profile/components/profile-content";

interface ProfilePageProps {
  params: {
    locale: string;
  };
}

export default async function ProfilePage({
  params: { locale },
}: ProfilePageProps) {
  const user = await getUser();
  if (!user) redirect(`/${locale}`);

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Header user={user} />
      <ProfileContent user={user} locale={locale} />
    </div>
  );
}
