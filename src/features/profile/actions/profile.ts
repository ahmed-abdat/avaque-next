"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { updateAvatar } from "@/app/[locale]/actions";
import { ProfileFormData } from "@/features/profile/validation/profile";

export async function updateProfile(data: ProfileFormData, locale: string) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) throw userError;

    const table =
      user.user_metadata.role === "consultant"
        ? "consultant_profiles"
        : "profiles";
    const { error } = await supabase
      .from(table)
      .update({
        full_name: data.full_name,
      })
      .eq("id", user?.id);

    if (error) throw error;

    revalidatePath(`/${locale}/profile`, "page");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Failed to update profile" };
  }
}

export async function uploadAvatar(formData: FormData, locale: string) {
  try {
    const result = await updateAvatar(formData);
    if (result.success) {
      revalidatePath(`/${locale}/profile`, "page");
    }
    return result;
  } catch (error) {
    console.error("Error in avatar update process:", error);
    return { error: "Failed to process avatar update" };
  }
}
