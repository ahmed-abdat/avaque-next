"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { ArrowLeft, Mail, AlertCircle } from "lucide-react";

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
        console.error(error);
        const rateLimitMatch = error.message.match(/after (\d+) seconds/);
        if (rateLimitMatch) {
          const seconds = rateLimitMatch[1];
          setError(t("common.errors.rateLimit", { seconds }));
          return;
        }
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

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="w-full max-w-md px-4 py-6">
        {/* Email Icon with Animated Background */}
        <div className="relative mx-auto mb-6 flex h-[90px] w-[90px] items-center justify-center">
          <div className="absolute inset-0 animate-pulse rounded-full bg-primary/10" />
          <div className="absolute inset-2 rounded-full bg-primary/20" />
          <Mail className="relative h-10 w-10 text-primary" strokeWidth={1.5} />
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="text-center">
              <h1 className="text-xl font-semibold tracking-tight">
                {t("forgotPassword.checkEmail")}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("forgotPassword.emailSent")}
              </p>
            </div>
            <Button asChild variant="outline" className="w-full gap-2 text-sm">
              <Link href={`/${locale}/login`}>
                <ArrowLeft className="h-4 w-4" />
                {t("forgotPassword.backToSignIn")}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <h1 className="text-xl font-semibold tracking-tight">
                {t("forgotPassword.title")}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("forgotPassword.subtitle")}
              </p>
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="border-destructive/50 text-destructive dark:border-destructive/50 dark:text-destructive"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="ml-2 text-sm font-medium">
                  {t("common.error")}
                </AlertTitle>
                <AlertDescription className="ml-6 text-xs">
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        {t("common.email")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t("common.emailPlaceholder")}
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
                      t("forgotPassword.resetPassword")
                    )}
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full gap-2 text-sm"
                  >
                    <Link href={`/${locale}/login`}>
                      <ArrowLeft className="h-4 w-4" />
                      {t("forgotPassword.backToSignIn")}
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
