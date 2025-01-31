import { z } from "zod";

type ForgotPasswordValidationKeys = {
  emailRequired: string;
  invalidEmail?: string;
};

export const createForgotPasswordSchema = (t: (key: string) => string) => {
  const validationKeys: ForgotPasswordValidationKeys = {
    emailRequired: t("common.validation.emailRequired"),
  };

  return z.object({
    email: z
      .string()
      .email( validationKeys.emailRequired)
      .min(1, { message: validationKeys.emailRequired }), // Ensure email is not empty
  });
};

export type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;
