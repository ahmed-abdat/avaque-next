import { z } from "zod";
import type { UserType } from "@/types/userType";

export const createProfileSchema = (t: any) =>
  z.object({
    full_name: z.string().min(2, t("validation.fullNameMin")),
    avatar_url: z.string().optional(),
  });

export type ProfileFormData = z.infer<ReturnType<typeof createProfileSchema>>;

export interface ProfileProps {
  user: UserType;
  locale: string;
}
