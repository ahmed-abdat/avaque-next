"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { Camera, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import type { UserType } from "@/types/userType";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { updateProfile, uploadAvatar } from "../action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface PersonalInfoTabProps {
  user: UserType;
  locale: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function PersonalInfoTab({ user, locale }: PersonalInfoTabProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    user.avatar_url || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [displayName, setDisplayName] = useState(user.full_name ?? "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("Profile.personalInfo");
  const isRtl = locale === "ar";

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user.full_name ?? "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    try {
      // First update profile info
      const profileResult = await updateProfile(data);
      if (profileResult.error) {
        throw new Error(profileResult.error);
      }
      setDisplayName(data.full_name);

      // Handle avatar changes
      if (selectedFile || previewUrl === null) {
        setIsUploading(true);
        const formData = new FormData();

        if (selectedFile) {
          formData.append("avatarFile", selectedFile);
        }

        // If we have an old avatar, send it to be deleted
        if (user.avatar_url) {
          formData.append("oldAvatarUrl", user.avatar_url);
        }

        // Only proceed with avatar update if we're either uploading a new file
        // or explicitly removing the old one
        if (selectedFile || previewUrl === null) {
          const avatarResult = await uploadAvatar(formData);
          if (avatarResult.error) {
            throw new Error(avatarResult.error);
          }
          if (avatarResult.avatarUrl) {
            setPreviewUrl(avatarResult.avatarUrl);
          } else {
            setPreviewUrl(null);
          }
        }
      }

      toast.success(t("updateSuccess"), {
        description: t("profileUpdated"),
      });

      // Reset selected file after successful upload
      setSelectedFile(null);
    } catch (error) {
      toast.error(t("updateError"), {
        description: error instanceof Error ? error.message : t("unknownError"),
      });
      // Revert preview and name on error
      setPreviewUrl(user.avatar_url || null);
      setDisplayName(user.full_name ?? "");
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast.error(t("avatarError"), {
        description: t("invalidFileType"),
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("avatarError"), {
        description: t("fileTooLarge"),
      });
      return;
    }

    // Preview
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>
      <Card className="overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Avatar Section */}
          <div
            className={cn(
              "flex flex-col items-center bg-muted/10 p-8 lg:w-80",
              "border-b lg:border-b-0",
              isRtl ? "lg:border-l" : "lg:border-r"
            )}
          >
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative h-32 w-32 lg:h-40 lg:w-40"
              >
                <Avatar className="h-full w-full">
                  <AvatarImage
                    src={previewUrl || ""}
                    alt={displayName}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-3xl">
                    {getInitials(displayName)}
                  </AvatarFallback>
                </Avatar>
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  </div>
                )}
              </motion.div>
              <div className="absolute -bottom-2 flex items-center justify-center gap-2">
                <Label
                  htmlFor="avatar-upload"
                  className={cn(
                    "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
                  )}
                >
                  <Camera className="h-5 w-5" />
                </Label>
                {previewUrl && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={handleRemoveAvatar}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>
              <Input
                ref={fileInputRef}
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={isUploading}
              />
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-xl font-semibold">{displayName}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="flex-1 space-y-8 p-8">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">{t("title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("description")}
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid gap-6 sm:grid-cols-2">
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
                            className="h-11"
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
                    <Input
                      id="email"
                      type="email"
                      value={user.email ?? ""}
                      disabled
                      className="h-11 bg-muted/50"
                    />
                  </div>
                </div>

                <div
                  className={cn(
                    "flex items-center pt-4",
                    isRtl ? "justify-start" : "justify-end"
                  )}
                >
                  <Button
                    type="submit"
                    size="lg"
                    className="min-w-[140px]"
                    disabled={isSaving || isUploading}
                  >
                    {(isSaving || isUploading) && (
                      <Loader2
                        className={cn(
                          "h-4 w-4 animate-spin",
                          isRtl ? "ml-2" : "mr-2"
                        )}
                      />
                    )}
                    {t("saveChanges")}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  );
}
