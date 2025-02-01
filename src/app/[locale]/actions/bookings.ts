"use server";

import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/app/[locale]/actions";
import { revalidatePath } from "next/cache";
import { Status } from "@/types/status";

export async function createBooking(
  consultantId: string,
  scheduledTime: Date,
  googleMeetLink: string
) {
  try {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    // Insert the booking
    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        student_id: user.id,
        consultant_id: consultantId,
        status: "pending",
        scheduled_time: scheduledTime,
        duration_minutes: 60, // 1 hour default
        total_amount: 200, // Default amount,
        google_meet_link: googleMeetLink,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Revalidate the consultant profile page
    revalidatePath(`/consultants/${consultantId}`);

    return { booking, error: null };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { booking: null, error };
  }
}

export async function getUserBookings(userId: string) {
  try {
    const supabase = await createClient();

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        consultant:consultant_id(
          full_name,
          avatar_url,
          specialization,
          is_approved
        )
      `
      )
      .eq("student_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    // Filter out bookings with unapproved consultants
    const approvedBookings = bookings?.filter(
      (booking) => booking.consultant?.is_approved
    );

    return { bookings: approvedBookings, error: null };
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return { bookings: null, error };
  }
}

export async function getBookingById(bookingId: string) {
  try {
    const supabase = await createClient();

    const { data: booking, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        consultant:consultant_id(
          full_name,
          avatar_url,
          specialization,
          is_approved
        )
      `
      )
      .eq("id", bookingId)
      .single();

    if (error) {
      throw error;
    }

    // Check if the consultant is approved
    if (!booking.consultant?.is_approved) {
      return { booking: null, error: new Error("Consultant not approved") };
    }

    return { booking, error: null };
  } catch (error) {
    console.error("Error fetching booking:", error);
    return { booking: null, error };
  }
}

export async function getUserActiveBookings(consultantId?: string) {
  try {
    const user = await getUser();
    if (!user) return { bookings: [] };

    const supabase = await createClient();
    let query = supabase
      .from("bookings")
      .select(
        `
        *,
        consultant:consultant_id(
          is_approved
        )
      `
      )
      .eq("student_id", user.id)
      .eq("status", "completed"); // Only get completed bookings

    if (consultantId) {
      query = query.eq("consultant_id", consultantId);
    }

    const { data: bookings, error } = await query;

    if (error) throw error;

    // Filter out bookings with unapproved consultants
    const approvedBookings =
      bookings?.filter((booking) => booking.consultant?.is_approved) || [];

    return { bookings: approvedBookings };
  } catch (error) {
    console.error("Error fetching active bookings:", error);
    return { bookings: [], error };
  }
}
