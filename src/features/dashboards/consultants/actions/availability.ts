"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/app/[locale]/actions";
import type {
  DayAvailability,
  AvailabilityResponse,
  AvailabilityUpdateResponse,
  DayOfWeek,
} from "../types";
import { formatTimeForAPI } from "../utils/availability";

export async function getConsultantAvailability(
  consultantId?: string
): Promise<AvailabilityResponse> {
  try {
    const supabase = await createClient();
    const user = consultantId ? { id: consultantId } : await getCurrentUser();

    if (!user) {
      return { error: "Not authenticated", availability: null };
    }

    const { data: availability, error } = await supabase
      .from("consultant_availability")
      .select("*")
      .eq("consultant_id", user.id)
      .order("day");

    if (error) {
      console.error("Error fetching availability:", error);
      return { error: error.message, availability: null };
    }

    return { availability, error: null };
  } catch (error) {
    console.error("Error in getConsultantAvailability:", error);
    return { error: "Failed to fetch availability", availability: null };
  }
}

export async function updateConsultantAvailability(availabilityData: {
  toUpdate: Omit<DayAvailability, "created_at" | "updated_at">[];
  toDelete: string[]; // days to delete
}): Promise<AvailabilityUpdateResponse> {
  try {
    const supabase = await createClient();
    const user = await getCurrentUser();

    if (!user) {
      return { error: "Not authenticated", success: false };
    }

    // First delete the disabled days
    if (availabilityData.toDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from("consultant_availability")
        .delete()
        .eq("consultant_id", user.id)
        .in("day", availabilityData.toDelete);

      if (deleteError) throw new Error(deleteError.message);
    }

    // Then upsert the enabled days
    if (availabilityData.toUpdate.length > 0) {
      const { error: upsertError } = await supabase
        .from("consultant_availability")
        .upsert(
          availabilityData.toUpdate.map((a) => ({
            consultant_id: user.id,
            day: a.day,
            start_time: a.start_time,
            end_time: a.end_time,
          })),
          {
            onConflict: "consultant_id,day",
            ignoreDuplicates: false,
          }
        );

      if (upsertError) throw new Error(upsertError.message);
    }

    revalidatePath("/dashboard/availability");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating availability:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to update availability",
      success: false,
    };
  }
}

// Check if a specific time slot is available
export async function checkTimeSlotAvailability(
  consultantId: string,
  date: Date
) {
  try {
    const supabase = await createClient();

    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = date.getDay();
    const days: DayOfWeek[] = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const dayName = days[dayOfWeek];

    // Format time as HH:mm:ss for API
    const timeStr = formatTimeForAPI(date.toTimeString().substring(0, 5));

    // Check consultant's availability for this day and time
    const { data: availability, error: availabilityError } = await supabase
      .from("consultant_availability")
      .select("*")
      .eq("consultant_id", consultantId)
      .eq("day", dayName)
      .lte("start_time", timeStr)
      .gte("end_time", timeStr)
      .single();

    if (availabilityError && availabilityError.code !== "PGRST116") {
      // PGRST116 is "no rows returned"
      console.error("Error checking availability:", availabilityError);
      return { error: availabilityError.message, isAvailable: false };
    }

    // If no availability found for this day/time
    if (!availability) {
      return { isAvailable: false, error: null };
    }

    // Check for existing bookings at this time
    const { data: existingBooking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("consultant_id", consultantId)
      .eq("scheduled_time", date.toISOString())
      .single();

    if (bookingError && bookingError.code !== "PGRST116") {
      console.error("Error checking bookings:", bookingError);
      return { error: bookingError.message, isAvailable: false };
    }

    // Time slot is available if there's no existing booking
    return { isAvailable: !existingBooking, error: null };
  } catch (error) {
    console.error("Error in checkTimeSlotAvailability:", error);
    return { error: "Failed to check availability", isAvailable: false };
  }
}
