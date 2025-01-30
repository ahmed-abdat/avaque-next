"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitReview } from "@/app/[locale]/actions/consultant";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StarRating } from "./star-rating";
import { Review } from "../../types";

export interface ReviewFormProps {
  consultantId: string;
  onSuccess?: (review: Review) => void;
}

export function ReviewForm({ consultantId, onSuccess }: ReviewFormProps) {
  const t = useTranslations("ConsultantProfile.review");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    try {
      setIsSubmitting(true);
      const result = await submitReview(consultantId, rating, comment);

      if (result.error) {
        toast.error(t("error"));
        return;
      }

      if (result.review && onSuccess) {
        onSuccess(result.review);
      }

      toast.success(t("success"));
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(t("error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("rating")}</label>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">
              {t("comment")}
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("commentPlaceholder")}
              rows={4}
            />
          </div>
          <Button type="submit" disabled={rating === 0 || isSubmitting}>
            {isSubmitting ? t("submitting") : t("submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
