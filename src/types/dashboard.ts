// Base types for database entities
export interface ConsultantProfile {
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
}

export interface Profile {
  avatar_url: string | null;
  created_at: string;
  email: string | null;
  full_name: string | null;
  id: string;
  role: "admin" | "consultant" | "student";
  updated_at: string;
}

export interface Booking {
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
}

// Combined types
export type BookingRecord = Booking & {
  profiles: Profile;
};

export interface ConsultationRequest {
  id: string;
  studentName: string;
  studentEmail: string;
  status: "pending" | "approved" | "rejected" | "completed";
  subject: string;
  message: string;
  proposedDate: string;
  requestDate: string;
}

export interface DashboardStats {
  totalBookings: number;
  totalEarnings: number;
  totalHours: number;
}

export interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  earningsData: Array<{ date: string; amount: number }>;
  requests: BookingRecord[];
  profileData: ConsultantProfile | null;
  locale: string;
  stats: DashboardStats;
}

export interface NavigationLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}
