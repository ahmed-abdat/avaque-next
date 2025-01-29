import { z } from "zod";

export const createLoginSchema = (t: any) =>
  z.object({
    email: z.string().email({
      message: t("common.validation.emailRequired"),
    }),
    password: z.string().min(6, {
      message: t("common.validation.passwordMin"),
    }),
  });

export const createRegisterSchema = (t: any) =>
  z.object({
    fullName: z.string().min(2, {
      message: t("common.validation.fullNameMin"),
    }),
    email: z.string().email({
      message: t("common.validation.emailRequired"),
    }),
    password: z.string().min(6, {
      message: t("common.validation.passwordMin"),
    }),
  });

export const createForgotPasswordSchema = (t: any) =>
  z.object({
    email: z.string().email({
      message: t("common.validation.emailRequired"),
    }),
  });

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
export type RegisterFormValues = z.infer<
  ReturnType<typeof createRegisterSchema>
>;
export type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;
