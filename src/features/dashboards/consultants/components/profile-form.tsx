"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useState, memo } from "react";
import { IconUpload, IconX } from "@tabler/icons-react";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  type ConsultantProfileFormValues,
  createConsultantProfileSchema,
} from "@/lib/validations/consultant";
import { updateConsultantProfile } from "@/app/[locale]/actions/consultant";

import { updateAvatar } from "@/app/[locale]/actions";

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.avatar_url || null
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

  // Check if form values have changed
  const hasFormChanges = () => {
    const formValues = form.getValues();
    return (
      formValues.fullName !== initialData?.fullName ||
      formValues.bio_ar !== initialData?.bio_ar ||
      formValues.bio_fr !== initialData?.bio_fr ||
      formValues.shortDescription !== initialData?.shortDescription ||
      formValues.specialization !== initialData?.specialization ||
      selectedFile !== null
    );
  };

  const handleImageSelect = (file: File) => {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("errors.fileTooLarge"));
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error(t("errors.invalidFileType"));
      return;
    }

    // Create local preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setSelectedFile(file);
  };

  const removeImage = () => {
    if (previewUrl && selectedFile) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  async function onSubmit(data: ConsultantProfileFormValues) {
    // Check if anything has changed
    if (!hasFormChanges()) {
      toast.info(t("noChanges"));
      return;
    }

    try {
      setIsSubmitting(true);

      // Handle avatar upload/update separately if there's a file change
      if (selectedFile) {
        setIsUploadingAvatar(true);
        const avatarFormData = new FormData();
        avatarFormData.append("avatarFile", selectedFile);

        // If we have an old avatar, send it to be deleted
        if (initialData?.avatar_url) {
          avatarFormData.append("oldAvatarUrl", initialData.avatar_url);
        }

        // Update avatar first
        const avatarResult = await updateAvatar(avatarFormData);
        if (avatarResult.error) {
          toast.error(t("errors.avatarUploadFailed"));
          return;
        }
        setIsUploadingAvatar(false);
      }

      // Only update other fields if they've changed
      const hasProfileChanges =
        data.fullName !== initialData?.fullName ||
        data.bio_ar !== initialData?.bio_ar ||
        data.bio_fr !== initialData?.bio_fr ||
        data.shortDescription !== initialData?.shortDescription ||
        data.specialization !== initialData?.specialization;

      if (hasProfileChanges) {
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

      // Clear the selected file after successful upload
      setSelectedFile(null);
    } catch (error) {
      console.error("Profile update error:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t("updateError"));
      }
    } finally {
      setIsSubmitting(false);
      setIsUploadingAvatar(false);
    }
  }

  // Split form into smaller components
  const AvatarUpload = memo(({ control, initialData }: any) => (
    <FormField
      control={control}
      name="avatar_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("avatar.url")}</FormLabel>
          <FormControl>
            <div className="flex flex-col items-center gap-4">
              {/* Avatar Preview */}
              <Avatar className="w-32 h-32">
                <AvatarImage
                  src={previewUrl || ""}
                  alt={initialData?.fullName || "Avatar"}
                />
                <AvatarFallback className="text-xl">
                  {initialData?.fullName?.charAt(0).toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>

              {/* Upload Controls */}
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="avatar-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageSelect(file);
                  }}
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting || isUploadingAvatar}
                    onClick={() =>
                      document.getElementById("avatar-upload")?.click()
                    }
                    className="flex items-center gap-2"
                  >
                    <IconUpload className="size-4" />
                    {t("avatar.upload")}
                  </Button>
                  {previewUrl && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      disabled={isSubmitting || isUploadingAvatar}
                      onClick={removeImage}
                    >
                      <IconX className="size-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ));

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className={isRTL ? "text-right" : "text-left"}>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={`space-y-6 ${isRTL ? "rtl" : "ltr"}`}
          >
            <AvatarUpload control={form.control} initialData={initialData} />

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

            <Button
              type="submit"
              disabled={isSubmitting || isUploadingAvatar || !hasFormChanges()}
              className="w-full"
            >
              {isUploadingAvatar
                ? t("avatar.uploading")
                : isSubmitting
                ? t("updating")
                : t("updateProfile")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
