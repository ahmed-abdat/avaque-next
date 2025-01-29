import { ConsultantsWrapper } from "./_components/consultants-wrapper";
import { getAllConsultants } from "../actions/consultant";

export default async function ConsultantsPage({
  params,
}: {
  params: { locale: string };
}) {
  const isRtl = params.locale === "ar";

  // Get all consultants
  const consultants = (await getAllConsultants()) || [];

  return (
    <div className="min-h-screen bg-background">
      <ConsultantsWrapper
        consultants={consultants}
        locale={params.locale}
        isRtl={isRtl}
      />
    </div>
  );
}
