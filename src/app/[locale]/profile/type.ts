import { z } from "zod";

export const profileSchema = z.object({
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    avatar_url: z.string().optional(),
  });

  export type ProfileFormData = z.infer<typeof profileSchema>;