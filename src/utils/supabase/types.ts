export type UserRole = "admin" | "consultant" | "student";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConsultantProfile {
  id: string;
  specialization: string;
  bio_ar: string | null;
  bio_fr: string | null;
  hourly_rate: number;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export type BookingStatus =
  | "pending"
  | "payment_pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface Booking {
  id: string;
  student_id: string;
  consultant_id: string;
  status: BookingStatus;
  scheduled_time: string;
  duration_minutes: number;
  total_amount: number;
  google_meet_link: string | null;
  created_at: string;
  updated_at: string;
}

export type PaymentStatus = "pending" | "confirmed" | "rejected";

export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  payment_proof_url: string | null;
  status: PaymentStatus;
  confirmed_by: string | null;
  confirmed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  student_id: string;
  consultant_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

// Helper type for joined queries
export interface ConsultantWithProfile extends ConsultantProfile {
  profile: Profile;
}

export interface BookingWithRelations extends Booking {
  consultant: ConsultantWithProfile;
  student: Profile;
  payment?: Payment;
  review?: Review;
}

// Database interface
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>;
      };
      consultant_profiles: {
        Row: ConsultantProfile;
        Insert: Omit<ConsultantProfile, "created_at" | "updated_at">;
        Update: Partial<
          Omit<ConsultantProfile, "id" | "created_at" | "updated_at">
        >;
      };
      bookings: {
        Row: Booking;
        Insert: Omit<Booking, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Booking, "id" | "created_at" | "updated_at">>;
      };
      payments: {
        Row: Payment;
        Insert: Omit<Payment, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Payment, "id" | "created_at" | "updated_at">>;
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Review, "id" | "created_at" | "updated_at">>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
    };
  };
}
