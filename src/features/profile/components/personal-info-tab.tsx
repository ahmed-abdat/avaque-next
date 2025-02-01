"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

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
import { Label } from "@/components/ui/label";
import { FormCardLayout } from "@/components/shared/form-card-layout";
import { UserAvatarUpload } from "@/components/shared/user-avatar-upload";

import { updateProfile, uploadAvatar } from "../actions/profile";
import {
  createProfileSchema,
  type ProfileFormData,
  type ProfileProps,
} from "../validation/profile";
import type { AvatarUploadResponse } from "../types/avatar";
import { cn } from "@/lib/utils";

export function PersonalInfoTab({ user, locale }: ProfileProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    user.avatar_url || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [displayName, setDisplayName] = useState(user.full_name ?? "");
  const t = useTranslations("Profile.personalInfo");
  const tCommon = useTranslations("common");
  const isRtl = locale === "ar";

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(createProfileSchema(tCommon)),
    defaultValues: {
      full_name: user.full_name ?? "",
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
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  const handleAvatarUpdate = async () => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("avatarFile", selectedFile);
      }
      if (user.avatar_url && (selectedFile || previewUrl === null)) {
        formData.append("oldAvatarUrl", user.avatar_url);
      }

      const avatarResult = (await uploadAvatar(
        formData,
        locale
      )) as AvatarUploadResponse;
      if (avatarResult.error) {
        throw new Error(avatarResult.error);
      }

      setPreviewUrl(avatarResult.avatarUrl || null);
      setSelectedFile(null);
      return true;
    } catch (error) {
      toast.error(t("avatarError"), {
        description: error instanceof Error ? error.message : t("unknownError"),
      });
      setPreviewUrl(user.avatar_url || null);
      setSelectedFile(null);
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const hasNameChanged = form.getValues("full_name") !== user.full_name;
  const hasAvatarChanged =
    selectedFile !== null || (previewUrl === null && user.avatar_url);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);

    try {
      let nameUpdateSuccess = true;
      let avatarUpdateSuccess = true;

      if (hasNameChanged) {
        const profileResult = await updateProfile(data, locale);
        nameUpdateSuccess = !profileResult.error;
        if (nameUpdateSuccess) {
          setDisplayName(data.full_name);
        } else {
          throw new Error(profileResult.error);
        }
      }

      if (hasAvatarChanged) {
        avatarUpdateSuccess = await handleAvatarUpdate();
      }

      // Show appropriate success messages
      if (nameUpdateSuccess && avatarUpdateSuccess) {
        if (hasNameChanged && hasAvatarChanged) {
          toast.success(t("updateSuccess"), {
            description: `${t("profileUpdated")} ${t("avatarUpdated")}`,
          });
        } else if (hasNameChanged) {
          toast.success(t("updateSuccess"), {
            description: t("profileUpdated"),
          });
        } else if (hasAvatarChanged) {
          toast.success(t("avatarSuccess"), {
            description: t("avatarUpdated"),
          });
        }
      }

      if (!hasNameChanged && !hasAvatarChanged) {
        toast.info(t("noChanges"));
      }
    } catch (error) {
      toast.error(t("updateError"), {
        description: error instanceof Error ? error.message : t("unknownError"),
      });
      if (hasNameChanged) {
        setDisplayName(user.full_name ?? "");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <FormCardLayout isRTL={isRtl}>
      <div className="max-w-5xl mx-auto py-6">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            {t("title")}
          </h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Section */}
            <div className="relative flex flex-col items-center pt-8 pb-6 border-b">
              <UserAvatarUpload
                previewUrl={previewUrl}
                displayName={displayName}
                isUploading={isUploading}
                onAvatarChange={handleAvatarChange}
                onRemoveAvatar={handleRemoveAvatar}
                size="lg"
                className="mb-8"
              />
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      {t("fullName")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("fullNamePlaceholder")}
                        className="h-11 bg-background transition-all duration-200 hover:border-primary/50 focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {t("email")}
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={user.email ?? ""}
                    disabled
                    className="h-11 bg-muted/30 pr-10"
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div
              className={cn(
                "flex items-center pt-4",
                isRtl ? "justify-start" : "justify-end"
              )}
            >
              <Button
                type="submit"
                className={cn(
                  "min-w-[140px] h-11 text-base transition-all duration-300",
                  "bg-primary hover:bg-primary/90",
                  "shadow hover:shadow-primary/25",
                  (isSaving ||
                    isUploading ||
                    (!hasNameChanged && !hasAvatarChanged)) &&
                    "opacity-90 cursor-not-allowed"
                )}
                disabled={
                  isSaving ||
                  isUploading ||
                  (!hasNameChanged && !hasAvatarChanged)
                }
              >
                {isSaving || isUploading ? (
                  <>
                    <Loader2
                      className={cn(
                        "h-4 w-4 animate-spin",
                        isRtl ? "ml-2" : "mr-2"
                      )}
                    />
                    {isSaving ? t("saving") : t("uploading")}
                  </>
                ) : (
                  t("saveChanges")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </FormCardLayout>
  );
}
