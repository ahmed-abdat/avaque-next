export const DAYS = [
  "sunday", // 0
  "monday", // 1
  "tuesday", // 2
  "wednesday", // 3
  "thursday", // 4
  "friday", // 5
  "saturday", // 6
] as const;

export const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
] as const;

export const DEFAULT_START_TIME = "08:00";
export const DEFAULT_END_TIME = "17:00";

export const TIME_FORMAT = {
  UI: "HH:mm",
  API: "HH:mm:ss",
} as const;
