import { z } from "zod";

export const meetingLinkSchema = z.object({
    meetLink: z.string().url("Please enter a valid Google Meet URL"),
  });

export type MeetingLinkFormValues = z.infer<typeof meetingLinkSchema>;
