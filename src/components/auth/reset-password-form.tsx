"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeft, Lock, AlertCircle, CheckCircle2 } from "lucide-react";

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
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ResetPasswordFormProps {
  locale: string;
}

export function ResetPasswordForm({ locale }: ResetPasswordFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);

      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        console.log(error);

        // Update the condition to catch both possible error messages
        if (
          error.message.includes("same as your old") ||
          error.message.includes("should be different from the old")
        ) {
          setError(t("resetPassword.errors.samePassword"));
          return;
        }

        // Handle rate limiting errors
        const rateLimitMatch = error.message.match(/after (\d+) seconds/);
        if (rateLimitMatch) {
          const seconds = rateLimitMatch[1];
          setError(t("common.errors.rateLimit", { seconds }));
          return;
        }

        // Handle other specific error cases
        switch (error.message) {
          case "Auth session missing!":
            setError(t("resetPassword.errors.sessionExpired"));
            // Optionally redirect to forgot password page after a delay
            setTimeout(() => {
              router.push(`/${locale}/forgot-password`);
            }, 2000);
            break;
          case "Invalid login credentials":
            setError(t("resetPassword.errors.invalidSession"));
            break;
          default:
            setError(t("common.error"));
        }
        return;
      }

      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push(`/${locale}/login`);
      }, 2000);
    } catch (error) {
      console.error(error);
      setError(t("common.error"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="w-full max-w-md px-4 py-6">
        {/* Lock Icon with Animated Background */}
        <div className="relative mx-auto mb-6 flex h-[90px] w-[90px] items-center justify-center">
          <div className="absolute inset-0 animate-pulse rounded-full bg-primary/10" />
          <div className="absolute inset-2 rounded-full bg-primary/20" />
          <Lock className="relative h-10 w-10 text-primary" strokeWidth={1.5} />
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-semibold tracking-tight">
                {t("resetPassword.success")}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("resetPassword.successMessage")}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <h1 className="text-xl font-semibold tracking-tight">
                {t("resetPassword.title")}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("resetPassword.subtitle")}
              </p>
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="flex items-start py-2 dark:text-red-400 dark:bg-red-400/10 dark:border-red-400/50"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 dark:text-red-400" />
                <AlertDescription className="ml-2 text-xs">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        {t("resetPassword.newPassword")}
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder={t(
                            "resetPassword.newPasswordPlaceholder"
                          )}
                          className="text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        {t("resetPassword.confirmPassword")}
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder={t(
                            "resetPassword.confirmPasswordPlaceholder"
                          )}
                          className="text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-4">
                  <Button
                    type="submit"
                    className="w-full dark:bg-primary dark:hover:bg-primary/90 dark:text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      </div>
                    ) : (
                      t("resetPassword.resetButton")
                    )}
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full gap-2 text-sm"
                  >
                    <Link href={`/${locale}/login`}>
                      <ArrowLeft className="h-4 w-4" />
                      {t("resetPassword.backToLogin")}
                    </Link>
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
}
