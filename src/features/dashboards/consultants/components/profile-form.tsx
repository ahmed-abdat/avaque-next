"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormCardLayout } from "@/components/shared/form-card-layout";
import { UserAvatarUpload } from "@/components/shared/user-avatar-upload";

import {
  type ConsultantProfileFormValues,
  createConsultantProfileSchema,
} from "@/lib/validations/consultant";
import { updateConsultantProfile } from "@/app/[locale]/actions/consultant";
import { updateAvatar } from "@/app/[locale]/actions";
import { cn } from "@/lib/utils";

interface ProfileFormProps {
  initialData?: Partial<ConsultantProfileFormValues>;
  isRTL: boolean;
}

export function ConsultantProfileForm({
  initialData,
  isRTL,
}: ProfileFormProps) {
  const t = useTranslations("ConsultantProfile");
  const commonT = useTranslations("common");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(
    initialData?.avatar_url || ""
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<ConsultantProfileFormValues>({
    resolver: zodResolver(createConsultantProfileSchema(commonT)),
    defaultValues: {
      fullName: initialData?.fullName || "",
      bio_ar: initialData?.bio_ar || "",
      bio_fr: initialData?.bio_fr || "",
      shortDescription: initialData?.shortDescription || "",
      avatar_url: initialData?.avatar_url || "",
      hourlyRate: initialData?.hourlyRate || 0,
      specialization: initialData?.specialization || "",
    },
  });

  const handleAvatarChange = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setSelectedFile(file);
  };

  const handleRemoveAvatar = () => {
    if (previewUrl && selectedFile) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
    setSelectedFile(null);
  };

  const hasAvatarChanged = previewUrl != initialData?.avatar_url;
  // Check if form values have changed
  const hasFormChanges = () => {
    const formValues = form.getValues();
    return (
      formValues.fullName !== initialData?.fullName ||
      formValues.bio_ar !== initialData?.bio_ar ||
      formValues.bio_fr !== initialData?.bio_fr ||
      formValues.shortDescription !== initialData?.shortDescription ||
      formValues.specialization !== initialData?.specialization ||
      selectedFile !== null ||
      previewUrl !== initialData?.avatar_url
    );
  };

  async function onSubmit(data: ConsultantProfileFormValues) {
    if (!hasFormChanges() && !hasAvatarChanged) {
      toast.info(t("noChanges"));
      return;
    }

    try {
      setIsSubmitting(true);

      if (hasAvatarChanged) {
        setIsUploadingAvatar(true);
        const avatarFormData = new FormData();

        if (selectedFile) {
          avatarFormData.append("avatarFile", selectedFile);
        }

        if (initialData?.avatar_url) {
          avatarFormData.append("oldAvatarUrl", initialData.avatar_url);
          // Add a flag to indicate avatar deletion when previewUrl is null
          if (previewUrl === null) {
            avatarFormData.append("deleteAvatar", "true");
          }
        }

        const avatarResult = await updateAvatar(avatarFormData);

        if (!avatarResult.success || avatarResult.error) {
          toast.error(avatarResult.error || t("avatar.errors.uploadFailed"));
          return;
        }

        setPreviewUrl(avatarResult.avatarUrl);

        setIsUploadingAvatar(false);
      }

      if (hasFormChanges()) {
        const formData = new FormData();
        formData.append("fullName", data.fullName || "");
        formData.append("specialization", data.specialization || "");
        formData.append("shortDescription", data.shortDescription || "");
        formData.append("bio_ar", data.bio_ar || "");
        formData.append("bio_fr", data.bio_fr || "");

        const result = await updateConsultantProfile(formData);

        if (result.error) {
          throw new Error(result.error);
        }
      }

      toast.success(t("profileUpdated"));
      setSelectedFile(null);
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(t("updateError"));
    } finally {
      setIsSubmitting(false);
      setIsUploadingAvatar(false);
    }
  }

  return (
    <FormCardLayout title={t("title")} isRTL={isRTL}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={`space-y-6 ${isRTL ? "rtl" : "ltr"}`}
        >
          <div className="flex justify-center mb-8">
            <UserAvatarUpload
              previewUrl={previewUrl}
              displayName={form.getValues("fullName")}
              isUploading={isUploadingAvatar}
              onAvatarChange={handleAvatarChange}
              onRemoveAvatar={handleRemoveAvatar}
              size="lg"
            />
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{commonT("form.fullName")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={commonT("form.fullNamePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.specialization")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("fields.specializationPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.hourlyRate")}</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      type="number"
                      placeholder={t("fields.hourlyRatePlaceholder")}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.shortDescription")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("fields.shortDescriptionPlaceholder")}
                      className="h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.bioAr")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("fields.bioArPlaceholder")}
                      className="h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio_fr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.bioFr")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("fields.bioFrPlaceholder")}
                      className="h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || isUploadingAvatar || !hasFormChanges()}
            className="w-full"
          >
            {isUploadingAvatar ? (
              <>
                <Loader2
                  className={cn(
                    "h-4 w-4 animate-spin",
                    isRTL ? "ml-2" : "mr-2"
                  )}
                />
                {t("avatar.uploading")}
              </>
            ) : isSubmitting ? (
              <>
                <Loader2
                  className={cn(
                    "h-4 w-4 animate-spin",
                    isRTL ? "ml-2" : "mr-2"
                  )}
                />
                {t("updating")}
              </>
            ) : (
              t("updateProfile")
            )}
          </Button>
        </form>
      </Form>
    </FormCardLayout>
  );
}
