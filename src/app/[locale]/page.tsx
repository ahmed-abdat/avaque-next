import { LandingPage } from "@/components/landing-page";
import { getUser } from "./actions/auth";

export default async function Home({ params: { locale } }: { params: { locale: string } }) {
  const user = await getUser();
  return <LandingPage locale={locale} user={user} />;
}
