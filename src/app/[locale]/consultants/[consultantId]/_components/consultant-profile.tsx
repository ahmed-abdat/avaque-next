"use client";

import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Calendar, Clock, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitReview } from "@/app/[locale]/actions/consultant";
import type { Review } from "@/app/[locale]/actions/consultant";
import { ReviewForm } from "./review-form";
import { toast } from "sonner";

interface ConsultantProfileProps {
  consultant: any; // Replace with proper type
  reviews: Review[] | null;
  locale: string;
}

export function ConsultantProfile({
  consultant,
  reviews,
  locale,
}: ConsultantProfileProps) {
  const t = useTranslations("ConsultantProfile");
  const isRtl = locale === "ar";

  // Default hourly rate if not set
  const hourlyRate = 200;

  // Calculate average rating and total sessions from reviews
  const totalReviews = reviews?.length || 0;
  const averageRating =
    totalReviews > 0
      ? Math.round(
          ((reviews?.reduce((acc, review) => acc + review.rating, 0) || 0) /
            totalReviews) *
            10
        ) / 10
      : 0;

  const handleReviewSubmit = async (rating: number, comment: string) => {
    try {
      const result = await submitReview(consultant.id, rating, comment);

      if (result.error) {
        toast.error(t("review.error"));
        return;
      }

      toast.success(t("review.success"));
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(t("review.error"));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative border-b bg-muted/40">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-background" />

        <div className="mx-auto max-w-[1400px] px-4 py-12 md:px-6 lg:px-8">
          <div
            className={cn(
              "flex flex-col gap-8 md:flex-row",
              isRtl && "md:flex-row-reverse"
            )}
          >
            {/* Profile Image and Basic Info */}
            <div className="flex flex-col items-center text-center md:w-1/3">
              <Avatar className="h-40 w-40 md:h-48 md:w-48">
                <AvatarImage
                  src={consultant.avatar_url || ""}
                  alt={consultant.full_name || ""}
                />
                <AvatarFallback className="text-4xl">
                  {consultant.full_name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="mt-4">
                <h1 className="text-3xl font-bold tracking-tight">
                  {consultant.full_name}
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  {consultant.specialization}
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <span className="text-lg font-medium">
                    {averageRating} ({totalReviews} {t("sessions")})
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className={cn("flex-grow space-y-8", isRtl && "text-right")}>
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <Card className="border-none bg-primary/5 shadow-none">
                  <CardContent className="p-4">
                    <GraduationCap className="mb-2 h-5 w-5 text-primary" />
                    <div className="text-sm font-medium text-muted-foreground">
                      {t("stats.expertise")}
                    </div>
                    <div className="mt-1 text-xl font-semibold">
                      {consultant.specialization}
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-none bg-primary/5 shadow-none">
                  <CardContent className="p-4">
                    <Calendar className="mb-2 h-5 w-5 text-primary" />
                    <div className="text-sm font-medium text-muted-foreground">
                      {t("stats.sessions")}
                    </div>
                    <div className="mt-1 text-xl font-semibold">
                      {totalReviews}
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-none bg-primary/5 shadow-none">
                  <CardContent className="p-4">
                    <Clock className="mb-2 h-5 w-5 text-primary" />
                    <div className="text-sm font-medium text-muted-foreground">
                      {t("stats.hourlyRate")}
                    </div>
                    <div className="mt-1 text-xl font-semibold">
                      {hourlyRate} MRU
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* About Section */}
              <div>
                <h2 className="mb-4 text-xl font-semibold">
                  {t("tabs.about")}
                </h2>
                <Card className="border-none bg-card/50">
                  <CardContent className="p-6">
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      {consultant.short_description}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Book Session Button */}
              <Button size="lg" className="w-full">
                {t("bookSession")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="mx-auto max-w-[1400px] px-4 py-12 md:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="mb-6 text-2xl font-semibold">{t("review.title")}</h2>
          <ReviewForm
            consultantId={consultant.id}
            onSubmit={handleReviewSubmit}
            isRtl={isRtl}
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">{t("tabs.reviews")}</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews?.length ? (
              reviews.map((review: Review) => (
                <Card key={review.id} className="border-none bg-card/50">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-primary text-primary"
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString(
                            locale
                          )}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full border-none bg-card/50">
                <CardContent className="flex min-h-[200px] items-center justify-center p-6">
                  <p className="text-center text-muted-foreground">
                    {t("noReviews")}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
