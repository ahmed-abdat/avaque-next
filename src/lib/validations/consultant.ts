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

export const createConsultantProfileSchema = (t: any) =>
  z.object({
    fullName: z.string().min(2, {
      message: t("validation.fullNameMin"),
    }),
    bio_ar: z.string().min(50, {
      message: t("validation.shortDescriptionMin"),
    }),
    bio_fr: z.string().min(50, {
      message: t("validation.shortDescriptionMin"),
    }),
    shortDescription: z
      .string()
      .min(50, {
        message: t("validation.shortDescriptionMin"),
      })
      .max(500, {
        message: t("validation.shortDescriptionMax"),
      }),
    avatar_url: z.string().optional(),
    hourlyRate: z.number().min(0, {
      message: t("validation.hourlyRateMin"),
    }),
    specialization: z.string().min(1, {
      message: t("validation.specializationRequired"),
    }),
    meetLink: z
      .string()
      .url({
        message: t("validation.invalidMeetLink"),
      })
      .optional(),
  });

export const meetingLinkSchema = z.object({
  meetLink: z.string().url("Please enter a valid Google Meet URL"),
});

export type ConsultantProfileFormValues = z.infer<
  ReturnType<typeof createConsultantProfileSchema>
>;
export type MeetingLinkFormValues = z.infer<typeof meetingLinkSchema>;
