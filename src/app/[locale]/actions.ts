"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { UserType } from "@/types/userType";

export async function isUserExiste(email: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .single();

  if (data?.id && !error) {
    return { user: data, type: "student" };
  }

  // check if user is consultant
  const { data: consultantData, error: consultantError } = await supabase
    .from("consultant_profiles")
    .select("*")
    .eq("email", email)
    .single();

  if (consultantData?.id && !consultantError) {
    return { user: consultantData, type: "consultant" };
  }
  return null;
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    return null;
  }

  if (user) {
    // try to get the user from the database
    const { data, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      return data;
    }

    if (profileError || !data) {
      const { data: consultantData, error: consultantError } = await supabase
        .from("consultant_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (consultantData) {
        return consultantData;
      }
    }
  }

  return null;
}

export async function updateAvatar(formData: FormData) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: "Not authenticated" };
  }

  try {
    const avatarFile = formData.get("avatarFile") as File | null;
    const oldAvatarUrl = formData.get("oldAvatarUrl") as string | null;

    // Delete old avatar if it exists
    if (oldAvatarUrl && oldAvatarUrl.includes("avatar_images")) {
      const oldPath = oldAvatarUrl.split("avatar_images/").pop();
      if (oldPath) {
        try {
          await supabase.storage.from("avatar_images").remove([oldPath]);
          console.log("Old avatar deleted successfully");
        } catch (error) {
          console.error("Error deleting old avatar:", error);
          // Continue with upload if there is a new avatar
          if (!avatarFile) {
            return { error: "Failed to delete avatar" };
          }
        }
      }
    }

    // If no new avatar file, just update the profile with null avatar_url
    if (!avatarFile) {
      const table =
        user.user_metadata.role === "consultant"
          ? "consultant_profiles"
          : "profiles";
      const { error: updateError } = await supabase
        .from(table)
        .update({ avatar_url: null })
        .eq("id", user.id);

      if (updateError) {
        console.error("Error updating profile:", updateError);
        return { error: "Failed to update profile" };
      }

      revalidatePath("/", "layout");
      return { success: true, avatarUrl: "" };
    }

    // Validate new avatar file if it exists
    if (avatarFile.size > 5 * 1024 * 1024) {
      return { error: "File size too large (max 5MB)" };
    }

    if (!avatarFile.type.startsWith("image/")) {
      return { error: "Invalid file type" };
    }

    // Upload new avatar
    const fileExt = avatarFile.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatar_images")
      .upload(fileName, avatarFile, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error uploading avatar:", uploadError);
      return { error: uploadError.message || "Failed to upload avatar" };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatar_images").getPublicUrl(fileName);

    // Update the appropriate profile table
    const table =
      user.user_metadata.role === "consultant"
        ? "consultant_profiles"
        : "profiles";
    const { error: updateError } = await supabase
      .from(table)
      .update({ avatar_url: publicUrl })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating profile with avatar URL:", updateError);
      // Try to clean up the uploaded file
      try {
        await supabase.storage.from("avatar_images").remove([fileName]);
      } catch (error) {
        console.error("Error cleaning up avatar file:", error);
      }
      return { error: "Failed to update profile with new avatar" };
    }

    revalidatePath("/", "layout");
    return { success: true, avatarUrl: publicUrl };
  } catch (error) {
    console.error("Error in avatar update process:", error);
    return { error: "Failed to process avatar update" };
  }
}

// Add new reusable functions
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function getUserProfile(
  userId: string,
  role: "consultant" | "student"
) {
  const supabase = await createClient();
  const table = role === "consultant" ? "consultant_profiles" : "profiles";

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data;
}

export async function updateUserProfile(
  userId: string,
  role: "consultant" | "student",
  data: any
) {
  const supabase = await createClient();
  const table = role === "consultant" ? "consultant_profiles" : "profiles";

  try {
    const { error } = await supabase.from(table).update(data).eq("id", userId);

    if (error) throw error;

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error(`Error updating ${role} profile:`, error);
    return { error: `Failed to update ${role} profile` };
  }
}
