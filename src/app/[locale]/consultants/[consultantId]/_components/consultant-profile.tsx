"use client";

import { useTranslations } from "next-intl";
import { updateReview, deleteReview } from "@/app/[locale]/actions/reviews";
import { toast } from "sonner";
import { Review, ConsultantWithReviews } from "../../types";
import { ReviewForm } from "./review-form";
import { getUser } from "@/app/[locale]/actions";
import { getUserBookings } from "@/app/[locale]/actions/bookings";
import { useEffect, useState } from "react";
import { UserType } from "@/types/userType";
import { HOUR_RATE } from "@/constants/hour-rate";
import { ConsultantHeader } from "./ConsultantHeader";
import { ReviewCard } from "./ReviewCard";
import { EditReviewDialog } from "./EditReviewDialog";
import { BookingCard } from "./BookingCard";

interface UserProfile {
  name: string;
  avatarUrl: string | null;
}

interface ExtendedConsultantProfileProps {
  consultant: ConsultantWithReviews;
  reviews: Review[];
  locale: string;
  userProfiles: Map<string, UserProfile>;
}

// Main ConsultantProfile component
export function ConsultantProfile({
  consultant,
  reviews: initialReviews,
  locale,
  userProfiles,
}: ExtendedConsultantProfileProps) {
  const t = useTranslations("ConsultantProfile");
  const [canReview, setCanReview] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [reviews, setReviews] = useState(initialReviews);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editFormData, setEditFormData] = useState({
    rating: 0,
    comment: "",
  });

  useEffect(() => {
    const checkReviewEligibility = async () => {
      const currentUser = await getUser();
      setUser(currentUser);

      if (currentUser) {
        const { bookings } = await getUserBookings(currentUser.id);
        const hasCompletedBooking =
          bookings?.some(
            (booking) =>
              booking.consultant_id === consultant.id &&
              !reviews.some((review) => review.student_id === currentUser.id)
          ) || false;

        setCanReview(hasCompletedBooking);
      }
    };

    checkReviewEligibility();
  }, [consultant.id, reviews]);

  const totalReviews = reviews?.length || 0;
  const averageRating =
    totalReviews > 0
      ? Math.round(
          ((reviews?.reduce((acc, review) => acc + review.rating, 0) || 0) /
            totalReviews) *
            10
        ) / 10
      : 0;

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setEditFormData({
      rating: review.rating,
      comment: review.comment || "",
    });
  };

  const handleDeleteReview = async (review: Review) => {
    if (!confirm(t("review.deleteConfirmation"))) return;

    try {
      const result = await deleteReview(review.booking_id, consultant.id);
      if (result.error) {
        toast.error(t("review.deleteError"));
        return;
      }

      setReviews(reviews.filter((r) => r.booking_id !== review.booking_id));
      toast.success(t("review.deleteSuccess"));
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error(t("review.deleteError"));
    }
  };

  const handleUpdateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview || editFormData.rating === 0) return;

    try {
      setIsSubmitting(true);
      const result = await updateReview(
        editingReview.booking_id,
        editFormData.rating,
        editFormData.comment
      );

      if (result.error) {
        toast.error(t("review.updateError"));
        return;
      }

      setReviews(
        reviews.map((r) =>
          r.booking_id === editingReview.booking_id
            ? {
                ...r,
                rating: editFormData.rating,
                comment: editFormData.comment,
              }
            : r
        )
      );

      toast.success(t("review.updateSuccess"));
      setEditingReview(null);
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error(t("review.updateError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewReview = (review: Review) => {
    setReviews((prevReviews) => [review, ...prevReviews]);
    setCanReview(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="relative bg-primary/5 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Profile Info */}
            <div className="lg:col-span-2">
              <ConsultantHeader
                consultant={consultant}
                averageRating={averageRating}
                totalReviews={totalReviews}
                userProfiles={userProfiles}
              />
            </div>

            {/* Booking Card */}
            {user && user.role !== "consultant" && (
              <div className="lg:col-span-1">
                <BookingCard
                  hourlyRate={HOUR_RATE}
                  consultant={consultant}
                  locale={locale}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-12">
            {/* About Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">{t("tabs.about")}</h2>
              <div className="prose dark:prose-invert max-w-none">
                {locale === "fr" ? consultant.bio_fr : consultant.bio_ar}
              </div>
            </section>

            {/* Reviews Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">
                {t("tabs.reviews")}
              </h2>
              <div className="space-y-6">
                {canReview && (
                  <ReviewForm
                    consultantId={consultant.id}
                    onSuccess={handleNewReview}
                  />
                )}

                {reviews.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {reviews.map((review) => (
                      <ReviewCard
                        key={review.booking_id}
                        review={review}
                        onEdit={handleEditReview}
                        onDelete={handleDeleteReview}
                        canModify={user?.id === review.student_id}
                        userProfile={userProfiles.get(review.student_id)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-12">
                    {t("noReviews")}
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Edit Review Dialog */}
      <EditReviewDialog
        isOpen={!!editingReview}
        onClose={() => setEditingReview(null)}
        onSubmit={handleUpdateReview}
        formData={editFormData}
        setFormData={setEditFormData}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
