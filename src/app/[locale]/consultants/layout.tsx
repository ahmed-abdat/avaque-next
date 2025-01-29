import Footer from "@/components/footer";
import { Header } from "@/components/header";
import { getUser } from "@/app/[locale]/actions/auth";

export default async function ConsultantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = await getUser();

  return (
    <>
      <Header user={userData} />
      {children}
      <Footer />
    </>
  );
}
