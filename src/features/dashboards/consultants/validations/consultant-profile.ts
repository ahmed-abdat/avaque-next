import { z } from "zod";


export const createConsultantProfileSchema = (t: any) =>
  z.object({
    full_name: z.string().min(2, {
      message: t("validation.fullNameMin"),
    }),
    bio_ar: z.string().min(50, {
      message: t("validation.shortDescriptionMin"),
    }),
    bio_fr: z.string().min(50, {
      message: t("validation.shortDescriptionMin"),
    }),
    avatar_url: z.string().optional(),
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


export type ConsultantProfileFormValues = z.infer<
  ReturnType<typeof createConsultantProfileSchema>
>;

