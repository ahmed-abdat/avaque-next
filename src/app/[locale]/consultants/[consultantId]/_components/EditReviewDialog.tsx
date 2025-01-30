"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "./star-rating";

interface EditReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: { rating: number; comment: string };
  setFormData: (data: { rating: number; comment: string }) => void;
  isSubmitting: boolean;
}

export function EditReviewDialog({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isSubmitting,
}: EditReviewDialogProps) {
  const t = useTranslations("ConsultantProfile.review");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("editTitle")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("rating")}</label>
            <StarRating
              value={formData.rating}
              onChange={(rating) => setFormData({ ...formData, rating })}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">
              {t("comment")}
            </label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              placeholder={t("commentPlaceholder")}
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={formData.rating === 0 || isSubmitting}
            >
              {isSubmitting ? t("updating") : t("update")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
