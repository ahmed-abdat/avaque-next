export const AVATAR_MAX_SIZE = 5 * 1024 * 1024; // 5MB
export const VALID_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export interface ProfileAvatarProps {
  previewUrl: string | null;
  displayName: string;
  isUploading: boolean;
  onAvatarChange: (file: File) => void;
  onRemoveAvatar: () => void;
  className?: string;
}

export interface AvatarUploadResponse {
  success?: boolean;
  error?: string;
  avatarUrl?: string;
}
