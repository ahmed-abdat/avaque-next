"use server";

import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { updateConsultantAvatar } from "@/app/[locale]/actions/consultant";
import { profileSchema, ProfileFormData } from "./type";

function getCurrentLocale(): string {
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";
  const locale = pathname.split("/")[1];
  return locale === "fr" ? "fr" : "ar"; // Default to "ar" if not "fr"
}

export async function updateProfile(data: ProfileFormData) {
  try {
    const validated = profileSchema.parse(data);
    const supabase = await createClient();
    const locale = getCurrentLocale();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) throw userError;

    if (user.user_metadata.role === "consultant") {
        const { error, data: profileData } = await supabase
        .from("consultant_profiles")
        .update({
            full_name: validated.full_name,
        })
        .eq("id", user?.id);

        if (error) throw error;

    }else{
        const { error, data: profileData } = await supabase
      .from("profiles")
      .update({
        full_name: validated.full_name,
      })
      .eq("id", user?.id);


      if (error) throw error;
    }

    revalidatePath(`/${locale}/profile`, "page");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Failed to update profile" };
  }
}

export async function uploadAvatar(formData: FormData) {
  try {
    const result = await updateConsultantAvatar(formData);
    if (result.success) {
      const locale = getCurrentLocale();
      revalidatePath(`/${locale}/profile`, "page");
    }
    return result;
  } catch (error) {
    console.error("Error in avatar update process:", error);
    return { error: "Failed to process avatar update" };
  }
}
