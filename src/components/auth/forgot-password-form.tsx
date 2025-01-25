"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { supabase } from "@/utils/supabase/client";
import {
  ForgotPasswordFormValues,
  createForgotPasswordSchema,
} from "@/lib/validations/auth";

export function ForgotPasswordForm({ locale }: { locale: string }) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("Auth");
  const forgotPasswordSchema = createForgotPasswordSchema(t);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    try {
      setError(null);
      setSuccess(false);
      setIsLoading(true);

      const { error } = await supabase.auth.resetPasswordForEmail(
        values.email,
        {
          redirectTo: `${window.location.origin}/${locale}/reset-password`,
        }
      );

      if (error) {
        // Extract seconds from rate limit error
        console.error(error);
        const rateLimitMatch = error.message.match(/after (\d+) seconds/);
        if (rateLimitMatch) {
          const seconds = rateLimitMatch[1];
          setError(t("common.errors.rateLimit", { seconds }));
          return;
        }

        // For any other error, show generic error message
        setError(t("common.error"));
        return;
      }

      setSuccess(true);
    } catch (error) {
      setError(t("common.error"));
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="w-full space-y-4">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("forgotPassword.checkEmail")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("forgotPassword.emailSent")}
          </p>
        </div>
        <div className="text-center">
          <Link
            href={`/${locale}/login`}
            className="text-sm font-medium text-primary hover:underline"
          >
            {t("forgotPassword.backToSignIn")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("forgotPassword.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("forgotPassword.subtitle")}
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/15 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common.email")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("common.emailPlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <Link
              href={`/${locale}/login`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {t("forgotPassword.backToSignIn")}
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              t("forgotPassword.resetPassword")
            )}
          </Button>

          <p className="text-sm text-center text-gray-600">
            {t("forgotPassword.rememberPassword")}{" "}
            <Link
              href={`/${locale}/login`}
              className="text-blue-600 hover:underline"
            >
              {t("login.signIn")}
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}
