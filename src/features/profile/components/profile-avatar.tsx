"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { formatNameToInitials } from "../utils/format-name";
import {
  ProfileAvatarProps,
  AVATAR_MAX_SIZE,
  VALID_IMAGE_TYPES,
} from "../types/avatar";

export function ProfileAvatar({
  previewUrl,
  displayName,
  isUploading,
  onAvatarChange,
  onRemoveAvatar,
  className,
}: ProfileAvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("Profile.personalInfo");

  const validateFile = (file: File): boolean => {
    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      toast.error(t("avatarError"), {
        description: t("invalidFileType"),
      });
      return false;
    }

    if (file.size > AVATAR_MAX_SIZE) {
      toast.error(t("avatarError"), {
        description: t("fileTooLarge"),
      });
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (validateFile(file)) {
      onAvatarChange(file);
    }

    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative h-32 w-32 lg:h-40 lg:w-40 transition-transform duration-200 ease-in-out hover:scale-[1.01]">
        <Avatar className="h-full w-full bg-transparent">
          <AvatarImage
            src={previewUrl || ""}
            alt={displayName}
            className="object-cover"
          />
          <AvatarFallback className="text-3xl">
            {formatNameToInitials(displayName)}
          </AvatarFallback>
        </Avatar>
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}
      </div>

      <div className="absolute w-full -bottom-4 left-1/2 flex -translate-x-1/2 items-center justify-center gap-2">
        <Label
          htmlFor="avatar-upload"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-200 hover:bg-primary/90 hover:shadow-xl active:scale-95"
        >
          <Camera className="h-5 w-5" />
        </Label>
        {previewUrl && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="h-10 w-10 rounded-full transition-all duration-200 hover:shadow-xl active:scale-95"
            onClick={onRemoveAvatar}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <Input
        ref={fileInputRef}
        id="avatar-upload"
        type="file"
        accept={VALID_IMAGE_TYPES.join(",")}
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </div>
  );
}
