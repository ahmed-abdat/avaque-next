import { AvailabilityState } from "../types";

export function validateAvailability(availability: AvailabilityState[]) {
  const errors: string[] = [];
  
  const parseTime = (timeString: string): number => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
  };

  availability.forEach(day => {
    if (!day.isEnabled) return;
    
    const start = parseTime(day.startTime);
    const end = parseTime(day.endTime);
    
    if (start >= end) {
      errors.push(`${day.day}: ${day.startTime} ≥ ${day.endTime}`);
    }
    if ((end - start) < 30 * 60 * 1000) {
      errors.push(`${day.day}: Minimum 30min slots required`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
} 