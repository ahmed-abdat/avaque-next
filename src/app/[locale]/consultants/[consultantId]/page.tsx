import {
  getAllUserWhoHaveReviews,
  getConsultantById,
  getReviewsByConsultantId,
} from "@/app/[locale]/actions/consultant";
import { notFound } from "next/navigation";
import { ConsultantProfile } from "./_components/consultant-profile";
import { ConsultantWithReviews, Review } from "../types";

interface ConsultantProfilePageProps {
  params: {
    locale: string;
    consultantId: string;
  };
}

export default async function ConsultantProfilePage({
  params: { locale, consultantId },
}: ConsultantProfilePageProps) {
  // Get consultant data, reviews, and user profiles
  const [consultant, reviews, userProfiles] = (await Promise.all([
    getConsultantById(consultantId),
    getReviewsByConsultantId(consultantId),
    getAllUserWhoHaveReviews(consultantId),
  ])) as [
    ConsultantWithReviews,
    Review[],
    Map<string, { name: string; avatarUrl: string | null }>
  ];

  // If consultant not found, show 404
  if (!consultant) {
    notFound();
  }

  return (
    <ConsultantProfile
      consultant={consultant}
      reviews={reviews || []}
      locale={locale}
      userProfiles={userProfiles || new Map()}
    />
  );
}
