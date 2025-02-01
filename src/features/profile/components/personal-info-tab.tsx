"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { updateProfile, uploadAvatar } from "../actions/profile";
import {
  createProfileSchema,
  type ProfileFormData,
  type ProfileProps,
} from "../validation/profile";
import { ProfileAvatar } from "./profile-avatar";
import type { AvatarUploadResponse } from "../types/avatar";
import { motion } from "framer-motion";
import { Camera, X, Lock } from "lucide-react";

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
  const profileSchema = createProfileSchema(tCommon);
  const isRtl = locale === "ar";

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
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

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    const hasNameChanged = data.full_name !== user.full_name;
    const hasAvatarChanged =
      selectedFile !== null || (previewUrl === null && user.avatar_url);

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
    <div dir={isRtl ? "rtl" : "ltr"} className="container max-w-5xl mx-auto">
      {/* Header Section */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-semibold tracking-tight">{t("title")}</h2>
        <p className="text-muted-foreground mt-1">{t("description")}</p>
      </motion.div>

      <Card className="overflow-hidden">
        <div className="flex flex-col">
          {/* Avatar Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative flex flex-col items-center pt-8 pb-6 border-b"
          >
            <div className="relative group">
              <ProfileAvatar
                previewUrl={previewUrl}
                displayName={displayName}
                isUploading={isUploading}
                onAvatarChange={handleAvatarChange}
                onRemoveAvatar={handleRemoveAvatar}
                className="h-28 w-28 shadow-lg ring-2 ring-background"
              />
              <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 text-white"
                    onClick={() =>
                      document.getElementById("avatar-upload")?.click()
                    }
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  {previewUrl && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 text-white"
                      onClick={handleRemoveAvatar}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </motion.div>

          {/* Form Section */}
          <div className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 max-w-xl mx-auto"
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="grid gap-6"
                >
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
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
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
                      (isSaving || isUploading) && "opacity-90"
                    )}
                    disabled={isSaving || isUploading}
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
                </motion.div>
              </form>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  );
}
