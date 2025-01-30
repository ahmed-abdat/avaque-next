export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  role: "student" | "consultant" | "admin";
  created_at: string;
  updated_at: string;
}

export interface ConsultantProfile extends User {
  specialization: string;
  short_description: string;
  bio_ar?: string;
  bio_fr?: string;
  meet_link?: string;
  is_approved: boolean;
}

export interface Booking {
  id: string;
  student_id: string;
  consultant_id: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  description: string;
  created_at: string;
  updated_at: string;
}
