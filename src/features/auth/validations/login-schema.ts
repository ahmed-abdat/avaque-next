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
  


export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
