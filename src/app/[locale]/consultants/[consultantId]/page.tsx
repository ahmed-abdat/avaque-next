import {
  getAllUserWhoHaveReviews,
  getConsultantById,
  getReviewsByConsultantId,
} from "@/app/[locale]/actions/consultant";
import { notFound } from "next/navigation";
import { ConsultantProfile } from "./_components/consultant-profile";

interface ConsultantProfilePageProps {
  params: {
    locale: string;
    consultantId: string;
  };
}

export default async function ConsultantProfilePage({
  params: { locale, consultantId },
}: ConsultantProfilePageProps) {
  // Get consultant data, reviews, and user names
  const [consultant, reviews, userMap] = await Promise.all([
    getConsultantById(consultantId),
    getReviewsByConsultantId(consultantId),
    getAllUserWhoHaveReviews(consultantId),
  ]);

  // If consultant not found, show 404
  if (!consultant) {
    notFound();
  }

  return (
    <ConsultantProfile
      consultant={consultant}
      reviews={reviews || []}
      locale={locale}
      userMap={userMap || new Map()}
    />
  );
}
