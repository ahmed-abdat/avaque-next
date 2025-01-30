import { Database } from "@/types/database.types";

export type ConsultantProfile =
  Database["public"]["Tables"]["consultant_profiles"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];

export interface ConsultantWithReviews extends ConsultantProfile {
  reviews: Review[];
  rating?: number;
  totalSessions?: number;
}

// Helper function to calculate rating
export function calculateRating(reviews: Review[]): number {
  if (!reviews.length) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Number((sum / reviews.length).toFixed(1));
}

// Helper function to calculate total sessions from bookings
export function calculateTotalSessions(bookings: Booking[]): number {
  return bookings.filter((booking) => booking.status === "completed").length;
}

// Type for the consultant profile component props
export interface ConsultantProfileComponentProps {
  consultant: ConsultantWithReviews;
  reviews: Review[];
  locale: string;
}
