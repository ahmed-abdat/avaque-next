"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import type {
  ConsultantRegisterValues,
  MeetingLinkFormValues,
} from "@/lib/validations/consultant";
import { headers } from "next/headers";
import { meetingLinkSchema } from "@/lib/validations/consultant";

// Helper to get current locale
function getCurrentLocale(): string {
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";
  const locale = pathname.split("/")[1];
  return locale === "fr" ? "fr" : "ar"; // Default to "ar" if not "fr"
}

export async function consultantSignup(values: ConsultantRegisterValues) {
  const supabase = await createClient();
  const locale = getCurrentLocale();

  // First, sign up the user with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: {
        full_name: values.fullName,
        role: "consultant",
        specialization: values.specialization,
        short_description: values.shortDescription,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}${process.env.NEXT_PUBLIC_VERIFY_EMAIL_REDIRECT}?type=email_verification`,
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  // The trigger function will handle creating the consultant profile
  revalidatePath("/", "layout");
  redirect(`/${locale}/verify-email`);
}

export async function consultantLogin(values: {
  email: string;
  password: string;
}) {
  const supabase = await createClient();
  const locale = getCurrentLocale();

  // First, attempt to sign in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (signInError) {
    // Check if the error is due to unverified email
    if (signInError.message.includes("Email not confirmed")) {
      return { error: "Email not confirmed" };
    }
    return { error: signInError.message };
  }

  // Then check if the user exists and is a consultant
  const { data: consultantProfile, error: consultantProfileError } =
    await supabase
      .from("consultant_profiles")
      .select("id, role, is_approved")
      .eq("email", values.email)
      .single();

  if (consultantProfileError || !consultantProfile) {
    await supabase.auth.signOut();
    return {
      error: "profile not found",
    };
  }

  if (!consultantProfile.is_approved) {
    await supabase.auth.signOut();
    return {
      error: "Your account is pending approval.",
    };
  }

  revalidatePath("/", "layout");
  redirect(`/${locale}/dashboard`);
}

export async function isConsultantExist(email: string) {
  const supabase = await createClient();

  // First check in profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (profile?.id) {
    return { id: profile.id, type: "profile" };
  }

  // Then check in consultant_profiles table for approved consultants only
  const { data: consultantProfile } = await supabase
    .from("consultant_profiles")
    .select("id")
    .eq("email", email)
    .eq("is_approved", true)
    .single();

  if (consultantProfile?.id) {
    return { id: consultantProfile.id, type: "consultant" };
  }

  return null;
}

export async function getConsultantProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  // make sure is_approved is true
  const { data: consultantProfile, error } = await supabase
    .from("consultant_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) return null;
  return consultantProfile;
}

export async function getAllConsultants() {
  const supabase = await createClient();

  // Get consultants with their reviews, only approved ones
  const { data: consultants, error } = await supabase
    .from("consultant_profiles")
    .select(
      `
      *,
      reviews:reviews(rating)
    `
    )
    .eq("is_approved", true); // Only get approved consultants

  if (error) return null;

  // Process each consultant to get their stats
  const consultantsWithStats = await Promise.all(
    consultants.map(async (consultant) => {
      // Get reviews and calculate average rating
      const reviews = consultant.reviews || [];
      const totalRating = reviews.reduce(
        (sum: number, review: any) => sum + (review.rating || 0),
        0
      );
      const averageRating =
        reviews.length > 0
          ? parseFloat((totalRating / reviews.length).toFixed(1))
          : 0;

      // Get the user map to count total sessions
      const userMap = await getAllUserWhoHaveReviews(consultant.id);
      const totalSessions = userMap ? userMap.size : 0;

      return {
        ...consultant,
        rating: averageRating,
        totalSessions,
        reviews: undefined, // Remove the raw reviews data
      };
    })
  );

  // Sort consultants by rating in descending order
  return consultantsWithStats.sort((a, b) => {
    // First sort by rating
    const ratingDiff = b.rating - a.rating;
    if (ratingDiff !== 0) return ratingDiff;

    // If ratings are equal, sort by total sessions
    return b.totalSessions - a.totalSessions;
  });
}

export async function getConsultantById(id: string) {
  const supabase = await createClient();
  const { data: consultant, error } = await supabase
    .from("consultant_profiles")
    .select("*")
    .eq("id", id)
    .eq("is_approved", true) // Only get approved consultants
    .single();

  if (error) return null;
  return consultant;
}

export async function updateConsultantAvatar(formData: FormData) {
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
    const avatarFile = formData.get("avatarFile") as File;
    const oldAvatarUrl = formData.get("oldAvatarUrl") as string;

    if (!avatarFile) {
      return { error: "No file provided" };
    }

    // Validate file size (5MB) and type on server side as well
    if (avatarFile.size > 5 * 1024 * 1024) {
      return { error: "File size too large (max 5MB)" };
    }

    if (!avatarFile.type.startsWith("image/")) {
      return { error: "Invalid file type" };
    }

    // Delete old avatar if it exists
    if (oldAvatarUrl && oldAvatarUrl.includes("avatar_images")) {
      const oldPath = oldAvatarUrl.split("avatar_images/").pop();
      if (oldPath) {
        try {
          await supabase.storage.from("avatar_images").remove([oldPath]);
        } catch (error) {
          console.error("Error deleting old avatar:", error);
          // Continue with upload even if delete fails
        }
      }
    }

    // Upload new avatar with user ID in path
    const fileExt = avatarFile.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError, data } = await supabase.storage
      .from("avatar_images")
      .upload(fileName, avatarFile, {
        cacheControl: "3600",
        upsert: true, // Changed to true to allow overwriting
      });

    if (uploadError) {
      console.error("Error uploading avatar:", uploadError);
      return { error: uploadError.message || "Failed to upload avatar" };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatar_images").getPublicUrl(fileName);

    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from("consultant_profiles")
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

    revalidatePath("/dashboard");
    return { success: true, avatarUrl: publicUrl };
  } catch (error) {
    console.error("Error in avatar update process:", error);
    return { error: "Failed to process avatar update" };
  }
}

export async function updateConsultantProfile(formData: FormData) {
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
    // Validate required fields
    const fullName = formData.get("fullName");
    const specialization = formData.get("specialization");
    const shortDescription = formData.get("shortDescription");

    if (!fullName || !specialization || !shortDescription) {
      return { error: "Required fields are missing" };
    }

    // Update profile data (excluding avatar)
    const { error: updateError } = await supabase
      .from("consultant_profiles")
      .update({
        full_name: fullName,
        specialization,
        short_description: shortDescription,
        bio_ar: formData.get("bio_ar") || "",
        bio_fr: formData.get("bio_fr") || "",
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return { error: "Failed to update profile" };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error in profile update process:", error);
    return { error: "Failed to process profile update" };
  }
}

export async function updateMeetingLink(values: MeetingLinkFormValues) {
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
    // Validate the data
    const validatedData = meetingLinkSchema.parse(values);

    // Update the meeting link
    const { error } = await supabase
      .from("consultant_profiles")
      .update({ meet_link: validatedData.meetLink })
      .eq("id", user.id);

    if (error) throw error;

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error updating meeting link:", error);
    return { error: "Failed to update meeting link" };
  }
}

export interface Review {
  id: string;
  consultant_id: string;
  student_id: string;
  booking_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export async function getReviewsByConsultantId(consultantId: string) {
  const supabase = await createClient();
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("consultant_id", consultantId)
    .order("created_at", { ascending: false });

  if (error) return null;
  return reviews as Review[];
}

// get all the user who have review for this consultant
export async function getAllUserWhoHaveReviews(consultantId: string) {
  const supabase = await createClient();

  // First get all reviews with their student_ids
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("student_id")
    .eq("consultant_id", consultantId);

  if (error || !reviews) return null;

  // Get unique student IDs using Object.keys and reduce
  const studentIds = Object.keys(
    reviews.reduce((acc, review) => {
      acc[review.student_id] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  // Fetch profiles for these students
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", studentIds);

  if (profilesError) return null;

  // Create a map of user IDs to full names
  const userMap = new Map(
    profiles.map((profile) => [profile.id, profile.full_name])
  );

  return userMap;
}

export async function submitReview(
  consultantId: string,
  rating: number,
  comment: string
) {
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
    // First, get the completed booking that hasn't been reviewed
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("id")
      .eq("student_id", user.id)
      .eq("consultant_id", consultantId)
      .eq("status", "completed")
      .single();

    if (bookingError || !booking) {
      return { error: "No eligible booking found for review" };
    }

    // Insert the review
    const { data: review, error } = await supabase
      .from("reviews")
      .insert({
        booking_id: booking.id,
        consultant_id: consultantId,
        student_id: user.id,
        rating,
        comment,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath(`/consultants/${consultantId}`);
    return { success: true, review };
  } catch (error) {
    console.error("Error submitting review:", error);
    return { error: "Failed to submit review" };
  }
}
