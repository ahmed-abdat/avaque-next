import type { DayAvailability, AvailabilityState, DayOfWeek } from "../types";
import {
  DEFAULT_START_TIME,
  DEFAULT_END_TIME,
  DAYS,
} from "../constants/availability";

export function formatTimeForUI(time: string): string {
  // Convert "HH:mm:ss" to "HH:mm"
  return time.substring(0, 5);
}

export function formatTimeForAPI(time: string): string {
  // Convert "HH:mm" to "HH:mm:ss"
  return `${time}:00`;
}

export function transformAvailabilityForState(
  data: DayAvailability[] | null,
  days: readonly DayOfWeek[]
): AvailabilityState[] {
  if (!data) return getDefaultAvailability(days);

  const availabilityMap = new Map(data.map((item) => [item.day, item]));

  return Array.from(days).map((day) => {
    const existing = availabilityMap.get(day);
    return {
      day,
      startTime: existing
        ? formatTimeForUI(existing.start_time)
        : DEFAULT_START_TIME,
      endTime: existing ? formatTimeForUI(existing.end_time) : DEFAULT_END_TIME,
      isEnabled: !!existing,
      id: existing?.id,
    };
  });
}

export function transformAvailabilityForApi(
  availability: AvailabilityState[],
  consultantId: string
) {
  // Split availability into updates and deletes
  const toUpdate = availability
    .filter((day) => day.isEnabled)
    .map(({ day, startTime, endTime }) => ({
      day,
      start_time: `${startTime}:00`,
      end_time: `${endTime}:00`,
      consultant_id: consultantId,
    }));

  const toDelete = availability
    .filter((day) => !day.isEnabled)
    .map(({ day }) => day);

  return { toUpdate, toDelete };
}

export function getDefaultAvailability(
  days: readonly DayOfWeek[]
): AvailabilityState[] {
  return Array.from(days).map((day) => ({
    day,
    startTime: DEFAULT_START_TIME,
    endTime: DEFAULT_END_TIME,
    isEnabled: false,
  }));
}

export function isTimeSlotAvailable(
  availability: AvailabilityState[],
  date: Date
): boolean {
  const days = DAYS;
  const dayOfWeek = days[date.getDay()];
  const timeString = date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  const dayAvailability = availability.find((a) => a.day === dayOfWeek);

  if (!dayAvailability || !dayAvailability.isEnabled) {
    return false;
  }

  return (
    timeString >= dayAvailability.startTime &&
    timeString <= dayAvailability.endTime
  );
}
