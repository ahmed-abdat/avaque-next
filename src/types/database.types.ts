export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          consultant_id: string;
          created_at: string;
          duration_minutes: number;
          google_meet_link: string | null;
          id: string;
          scheduled_time: string;
          status: string;
          student_id: string;
          total_amount: number;
          updated_at: string;
        };
        Insert: {
          consultant_id: string;
          created_at?: string;
          duration_minutes?: number;
          google_meet_link?: string | null;
          id?: string;
          scheduled_time: string;
          status?: string;
          student_id: string;
          total_amount: number;
          updated_at?: string;
        };
        Update: {
          consultant_id?: string;
          created_at?: string;
          duration_minutes?: number;
          google_meet_link?: string | null;
          id?: string;
          scheduled_time?: string;
          status?: string;
          student_id?: string;
          total_amount?: number;
          updated_at?: string;
        };
        Relationships: {
          consultant_profiles: {
            foreignKeyName: "bookings_consultant_id_fkey";
            columns: ["consultant_id"];
            isOneToOne: false;
            referencedRelation: "consultant_profiles";
            referencedColumns: ["id"];
          };
        };
      };
      consultant_profiles: {
        Row: {
          avatar_url: string | null;
          bio_ar: string | null;
          bio_fr: string | null;
          created_at: string;
          email: string;
          full_name: string | null;
          hourly_rate: number;
          id: string;
          is_approved: boolean | null;
          meet_link: string | null;
          role: "admin" | "consultant" | "student";
          short_description: string;
          specialization: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          bio_ar?: string | null;
          bio_fr?: string | null;
          created_at?: string;
          email: string;
          full_name?: string | null;
          hourly_rate?: number;
          id: string;
          is_approved?: boolean | null;
          meet_link?: string | null;
          role?: "admin" | "consultant" | "student";
          short_description?: string;
          specialization: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          bio_ar?: string | null;
          bio_fr?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string | null;
          hourly_rate?: number;
          id?: string;
          is_approved?: boolean | null;
          meet_link?: string | null;
          role?: "admin" | "consultant" | "student";
          short_description?: string;
          specialization?: string;
          updated_at?: string;
        };
        Relationships: Record<string, never>;
      };
      payments: {
        Row: {
          amount: number;
          booking_id: string;
          confirmed_at: string | null;
          confirmed_by: string | null;
          created_at: string;
          id: string;
          payment_proof_url: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          amount: number;
          booking_id: string;
          confirmed_at?: string | null;
          confirmed_by?: string | null;
          created_at?: string;
          id?: string;
          payment_proof_url?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          amount?: number;
          booking_id?: string;
          confirmed_at?: string | null;
          confirmed_by?: string | null;
          created_at?: string;
          id?: string;
          payment_proof_url?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: {
          bookings: {
            foreignKeyName: "payments_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: false;
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          };
        };
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          role: "admin" | "consultant" | "student";
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
          role?: "admin" | "consultant" | "student";
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          role?: "admin" | "consultant" | "student";
          updated_at?: string;
        };
        Relationships: Record<string, never>;
      };
      reviews: {
        Row: {
          booking_id: string;
          comment: string | null;
          consultant_id: string;
          created_at: string;
          id: string;
          rating: number;
          student_id: string;
          updated_at: string;
        };
        Insert: {
          booking_id: string;
          comment?: string | null;
          consultant_id: string;
          created_at?: string;
          id?: string;
          rating: number;
          student_id: string;
          updated_at?: string;
        };
        Update: {
          booking_id?: string;
          comment?: string | null;
          consultant_id?: string;
          created_at?: string;
          id?: string;
          rating?: number;
          student_id?: string;
          updated_at?: string;
        };
        Relationships: {
          bookings: {
            foreignKeyName: "reviews_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: true;
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          };
          consultant_profiles: {
            foreignKeyName: "reviews_consultant_id_fkey";
            columns: ["consultant_id"];
            isOneToOne: false;
            referencedRelation: "consultant_profiles";
            referencedColumns: ["id"];
          };
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: "admin" | "consultant" | "student";
    };
    CompositeTypes: Record<string, never>;
  };
}

// Convenience types
export type Tables = Database["public"]["Tables"];
export type TablesInsert<T extends keyof Tables> = Tables[T]["Insert"];
export type TablesUpdate<T extends keyof Tables> = Tables[T]["Update"];
export type TablesRow<T extends keyof Tables> = Tables[T]["Row"];
