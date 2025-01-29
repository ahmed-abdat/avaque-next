"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  consultantId: string;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  isRtl?: boolean;
}

export function ReviewForm({ consultantId, onSubmit, isRtl }: ReviewFormProps) {
  const t = useTranslations("ConsultantProfile");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    try {
      setIsSubmitting(true);
      await onSubmit(rating, comment);
      // Reset form
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-none bg-card/50">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className={cn("space-y-2", isRtl && "text-right")}>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t("review.rating")}
            </label>
            <div
              className={cn(
                "flex items-center gap-1",
                isRtl && "flex-row-reverse"
              )}
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  className="focus-visible:ring-ring rounded-sm focus-visible:outline-none focus-visible:ring-2"
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(value)}
                >
                  <Star
                    className={cn(
                      "h-6 w-6 transition-colors",
                      (hoveredRating ? value <= hoveredRating : value <= rating)
                        ? "fill-primary text-primary"
                        : "fill-muted text-muted-foreground"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className={cn("space-y-2", isRtl && "text-right")}>
            <label
              htmlFor="comment"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("review.comment")}
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("review.commentPlaceholder")}
              className={cn("min-h-[100px] resize-none", isRtl && "text-right")}
            />
          </div>

          <div className={cn("flex", isRtl ? "justify-start" : "justify-end")}>
            <Button
              type="submit"
              disabled={rating === 0 || isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? t("review.submitting") : t("review.submit")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
