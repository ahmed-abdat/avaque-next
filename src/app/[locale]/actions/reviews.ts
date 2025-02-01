"use server";

import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/app/[locale]/actions";
import { revalidatePath } from "next/cache";

export async function getUserReviewForConsultant(consultantId: string) {
  try {
    const user = await getUser();
    if (!user) return { review: null };

    const supabase = await createClient();
    const { data: review, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("student_id", user.id)
      .eq("consultant_id", consultantId)
      .single();

    if (error) throw error;
    return { review };
  } catch (error) {
    console.error("Error fetching user review:", error);
    return { review: null, error };
  }
}

export async function updateReview(
  bookingId: string,
  rating: number,
  comment: string
) {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const supabase = await createClient();
    const { data: review, error } = await supabase
      .from("reviews")
      .update({ rating, comment })
      .eq("booking_id", bookingId)
      .eq("student_id", user.id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath(`/consultants/${review.consultant_id}`);
    return { review };
  } catch (error) {
    console.error("Error updating review:", error);
    return { error };
  }
}

export async function deleteReview(bookingId: string, consultantId: string) {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const supabase = await createClient();
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("booking_id", bookingId)
      .eq("student_id", user.id);

    if (error) throw error;

    revalidatePath(`/consultants/${consultantId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting review:", error);
    return { error };
  }
}
