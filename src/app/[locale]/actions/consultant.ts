"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type { MeetingLinkFormValues } from "@/lib/validations/consultant";
import {
  getCurrentUser,
  getUserProfile,
  updateUserProfile,
} from "@/app/[locale]/actions";

export async function getConsultantProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  return await getUserProfile(user.id, "consultant");
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
    .eq("is_approved", true);

  if (error) return null;

  // Process each consultant to get their stats
  const consultantsWithStats = await Promise.all(
    consultants.map(async (consultant) => {
      const reviews = consultant.reviews || [];
      const totalRating = reviews.reduce(
        (sum: number, review: any) => sum + (review.rating || 0),
        0
      );
      const averageRating =
        reviews.length > 0
          ? parseFloat((totalRating / reviews.length).toFixed(1))
          : 0;

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
    const ratingDiff = b.rating - a.rating;
    if (ratingDiff !== 0) return ratingDiff;
    return b.totalSessions - a.totalSessions;
  });
}

export async function getConsultantById(id: string) {
  return await getUserProfile(id, "consultant");
}


export async function updateMeetingLink(values: MeetingLinkFormValues) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  try {
    // use the updateUserProfile function
    return await updateUserProfile("consultant", {
      meet_link: values.meetLink,
    }, user.id);
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

export async function getAllUserWhoHaveReviews(consultantId: string) {
  const supabase = await createClient();

  // First get all reviews with their student_ids
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("student_id")
    .eq("consultant_id", consultantId);

  if (error || !reviews) return null;

  // Get unique student IDs
  const studentIds = Array.from(
    new Set(reviews.map((review) => review.student_id))
  );

  // Fetch profiles for these students with avatar_url
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .in("id", studentIds);

  if (profilesError) return null;

  // Create a map of user IDs to profile info
  return new Map(
    profiles.map((profile) => [
      profile.id,
      { name: profile.full_name, avatarUrl: profile.avatar_url },
    ])
  );
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
