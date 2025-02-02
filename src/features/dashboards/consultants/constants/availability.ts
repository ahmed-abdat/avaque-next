export const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return `${hour}:00`;
});

export const DEFAULT_START_TIME = "08:00";
export const DEFAULT_END_TIME = "17:00";

export const TIME_FORMAT = {
  UI: "HH:mm",
  API: "HH:mm:ss",
} as const;
