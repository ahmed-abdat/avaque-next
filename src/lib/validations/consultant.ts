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
