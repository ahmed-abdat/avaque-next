import { z } from "zod";

export const createResetPasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      password: z.string().min(6, {
        message: t("validation.passwordMin"), // Consistent translation key
      }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordMatch"), // Consistent translation key
      path: ["confirmPassword"],
    });

export type ResetPasswordValues = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>; 


