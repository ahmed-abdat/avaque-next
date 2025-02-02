export interface ConsultationRequest {
    id: string;
    studentName: string;
    studentEmail: string;
    requestDate: string;
    status: string;
    proposedDate: string;
  }
  
// Add this type for the days
export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

// Update AvailabilityState to use the new type
export interface AvailabilityState {
  id?: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  isEnabled: boolean;
}

// Update DayAvailability to use the new type
export interface DayAvailability {
  id?: string;
  consultant_id: string;
  day: DayOfWeek;
  start_time: string;
  end_time: string;
  created_at?: string;
  updated_at?: string;
}

export interface AvailabilityResponse {
  error: string | null;
  availability: DayAvailability[] | null;
}

export interface AvailabilityUpdateResponse {
  error: string | null;
  success: boolean;
}
  