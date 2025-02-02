"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import * as z from "zod";

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
import { updateAvatar, updateUserProfile } from "@/app/[locale]/actions";
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
      full_name: initialData?.full_name || "",
      bio_ar: initialData?.bio_ar || "",
      bio_fr: initialData?.bio_fr || "",
      avatar_url: initialData?.avatar_url || "",
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

  const hasAvatarChanged = previewUrl !== initialData?.avatar_url;

  const hasFormChanges = () => {
    const formValues = form.getValues();
    const formFieldsChanged =
      formValues.full_name !== initialData?.full_name ||
      formValues.bio_ar !== initialData?.bio_ar ||
      formValues.bio_fr !== initialData?.bio_fr ||
      formValues.specialization !== initialData?.specialization;

    // If user has no avatar and no preview, consider no change
    if (!initialData?.avatar_url && !previewUrl) {
      return formFieldsChanged;
    }

    // If user has avatar and wants to delete it (empty preview)
    if (initialData?.avatar_url && !previewUrl) {
      return true;
    }

    // Normal avatar change check
    return formFieldsChanged || hasAvatarChanged;
  };

  async function onSubmit(
    values: z.infer<ReturnType<typeof createConsultantProfileSchema>>
  ) {
    if (!hasFormChanges()) {
      toast.info(t("noChanges"));
      return;
    }

    try {
      setIsSubmitting(true);

      // Handle avatar changes first
      if (hasAvatarChanged) {
        setIsUploadingAvatar(true);
        const avatarFormData = new FormData();

        // Only append avatarFile if we have a new file
        if (selectedFile) {
          avatarFormData.append("avatarFile", selectedFile);
        }

        // Always append oldAvatarUrl if it exists, needed for deletion
        if (initialData?.avatar_url) {
          avatarFormData.append("oldAvatarUrl", initialData.avatar_url);
        }

        const avatarResult = await updateAvatar(avatarFormData);

        if (!avatarResult.success) {
          toast.error(avatarResult.error || t("avatar.errors.uploadFailed"));
          return;
        }

        // Update the preview with the new URL (or empty string if deleted)
        setPreviewUrl(avatarResult.avatarUrl);
        setIsUploadingAvatar(false);
      }

      // Handle other form changes
      if (hasFormChanges()) {
        const result = await updateUserProfile("consultant", {
          full_name: values.full_name,
          specialization: values.specialization,
          bio_ar: values.bio_ar,
          bio_fr: values.bio_fr,
        });

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
              displayName={form.getValues("full_name")}
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
              name="full_name"
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
