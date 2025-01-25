"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/utils/supabase/client";
import { PasswordInput } from "@/components/ui/password-input";

export default function ResetPasswordPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const t = useTranslations("Auth");

  const resetPasswordSchema = z
    .object({
      password: z.string().min(6, {
        message: t("validation.passwordMin"),
      }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordMatch"),
      path: ["confirmPassword"],
    });

  type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ResetPasswordValues) {
    try {
      setError(null);
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        throw error;
      }

      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push(`/${locale}/login`);
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : t("common.error"));
    }
  }

  if (success) {
    return (
      <div className="w-full space-y-4">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("resetPassword.success")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("resetPassword.successMessage")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("resetPassword.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("resetPassword.subtitle")}
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/15 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {success ? (
        <div className="space-y-4">
          <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
            {t("resetPassword.successMessage")}
          </div>
          <Button asChild className="w-full">
            <Link href={`/${locale}/login`}>
              {t("resetPassword.backToLogin")}
            </Link>
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("resetPassword.newPassword")}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t("resetPassword.newPasswordPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("resetPassword.confirmPassword")}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t(
                        "resetPassword.confirmPasswordPlaceholder"
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? t("resetPassword.resetting")
                : t("resetPassword.resetButton")}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
