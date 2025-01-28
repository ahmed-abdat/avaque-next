import { z } from "zod";

export const createLoginSchema = (t: any) =>
  z.object({
    email: z.string().email({
      message: t("validation.emailRequired"),
    }),
    password: z.string().min(6, {
      message: t("validation.passwordMin"),
    }),
  });

export const createRegisterSchema = (t: any) =>
  z.object({
    fullName: z.string().min(2, {
      message: t("validation.fullNameMin"),
    }),
    email: z.string().email({
      message: t("validation.emailRequired"),
    }),
    password: z.string().min(6, {
      message: t("validation.passwordMin"),
    }),
    specialization: z.string().min(1, {
      message: t("validation.specializationRequired"),
    }),
    shortDescription: z
      .string()
      .min(50, {
        message: t("validation.shortDescriptionMin"),
      })
      .max(500, {
        message: t("validation.shortDescriptionMax"),
      }),
    role: z.literal("consultant").default("consultant"),
  });

export type ConsultantLoginValues = z.infer<
  ReturnType<typeof createLoginSchema>
>;
export type ConsultantRegisterValues = z.infer<
  ReturnType<typeof createRegisterSchema>
>;

export const consultantProfileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  bio_ar: z.string().min(50, "Arabic bio must be at least 50 characters"),
  bio_fr: z.string().min(50, "French bio must be at least 50 characters"),
  shortDescription: z
    .string()
    .min(10, "Short description must be at least 10 characters"),
  avatar_url: z.string().optional(),
  hourlyRate: z.number().min(0, "Hourly rate must be a positive number"),
  specialization: z
    .string()
    .min(2, "Specialization must be at least 2 characters"),
  meetLink: z.string().url("Please enter a valid Google Meet URL").optional(),
});

export const meetingLinkSchema = z.object({
  meetLink: z.string().url("Please enter a valid Google Meet URL"),
});

export type ConsultantProfileFormValues = z.infer<
  typeof consultantProfileSchema
>;
export type MeetingLinkFormValues = z.infer<typeof meetingLinkSchema>;
