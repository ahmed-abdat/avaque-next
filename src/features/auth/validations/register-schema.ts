import { z } from "zod";

export const createRegisterSchema = (t: any) =>
  z.object({
    fullName: z
      .string()
      .min(1, t("common.validation.fullNameMin"))
      .min(2, t("common.validation.fullNameMin")),
    email: z
      .string()
      .min(1, t("common.validation.emailRequired"))
      .email(t("common.validation.emailRequired")),
    password: z
      .string()
      .min(1, t("common.validation.passwordMin"))
      .min(6, t("common.validation.passwordMin")),
  });

export const createConsultantRegisterSchema = (t: any) =>
  z.object({
    fullName: z
      .string()
      .min(1, t("common.validation.fullNameMin"))
      .min(2, t("common.validation.fullNameMin")),
    email: z
      .string()
      .min(1, t("common.validation.emailRequired"))
      .email(t("common.validation.emailRequired")),
    password: z
      .string()
      .min(1, t("common.validation.passwordMin"))
      .min(6, t("common.validation.passwordMin")),
    specialization: z
      .string()
      .min(1, t("common.validation.specializationRequired")),
    shortDescription: z
      .string()
      .min(50, t("common.validation.shortDescriptionMin"))
      .max(500, t("common.validation.shortDescriptionMax")),
    role: z.literal("consultant"),
  });

export type RegisterFormValues = z.infer<
  ReturnType<typeof createRegisterSchema>
>;
export type ConsultantRegisterValues = z.infer<
  ReturnType<typeof createConsultantRegisterSchema>
>;
