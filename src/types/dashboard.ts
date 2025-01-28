import { Database } from "@/types/supabase";

export type ConsultantProfile =
  Database["public"]["Tables"]["consultant_profiles"]["Row"];

export type BookingRecord = Database["public"]["Tables"]["bookings"]["Row"] & {
  profiles: Database["public"]["Tables"]["profiles"]["Row"];
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
  activeRequests: number;
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
