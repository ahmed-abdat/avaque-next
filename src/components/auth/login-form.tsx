"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

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
import { LoginFormValues, createLoginSchema } from "@/lib/validations/auth";
import { GoogleSignInButton } from "./google-sign-in-button";
import { login } from "@/app/[locale]/actions/auth";
import { PasswordInput } from "@/components/ui/password-input";
import { ResendVerificationDialog } from "./resend-verification-dialog";

export function LoginForm({ locale }: { locale: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const t = useTranslations("Auth");
  const loginSchema = createLoginSchema(t);
  const isRtl = locale === "ar";

  // Check for verification success message and errors
  useEffect(() => {
    if (searchParams?.get("verified") === "true") {
      setSuccess(t("verifyEmail.success"));
    }

    // Handle URL error parameters
    const urlError = searchParams?.get("error");
    const errorCode = searchParams?.get("error_code");
    const errorDescription = searchParams?.get("error_description");

    if (urlError || errorCode || errorDescription) {
      // Handle specific error cases
      if (
        errorCode === "otp_expired" ||
        errorDescription?.includes("expired")
      ) {
        setError(t("verifyEmail.errors.linkExpired"));
      } else if (urlError === "No code provided") {
        setError(t("verifyEmail.errors.invalidLink"));
      } else if (errorCode === "access_denied") {
        setError(t("verifyEmail.errors.accessDenied"));
      } else {
        setError(t("common.error"));
      }
    }
  }, [searchParams, t]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      setError(null);
      setUnverifiedEmail(null);
      setIsPending(true);
      const result = await login(values);

      if (result.error) {
        console.log(result.error);
        // Map Supabase error messages to our translated error messages
        const errorMessage = result.error.toLowerCase();
        if (errorMessage.includes("invalid login credentials")) {
          setError(t("common.errors.invalidCredentials"));
        } else if (errorMessage.includes("email not confirmed")) {
          setError(t("common.errors.emailNotConfirmed"));
          setUnverifiedEmail(values.email);
        } else if (errorMessage.includes("too many requests")) {
          setError(t("common.errors.tooManyRequests"));
        } else if (errorMessage.includes("network")) {
          setError(t("common.errors.networkError"));
        } else if (errorMessage.includes("rate limit")) {
          // Extract seconds if available in the message
          const seconds = errorMessage.match(/\d+/)?.[0] || "60";
          setError(t("common.errors.rateLimit", { seconds }));
        } else {
          setError(t("common.error"));
        }
        return;
      }

      router.replace(`/${locale}/dashboard`);
    } catch (error) {
      console.error(error);
      setError(t("common.error"));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("login.title")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("login.subtitle")}</p>

        {/* Sign up link */}
        <div className="mt-2 text-sm">
          {t("login.noAccount")}{" "}
          <Button
            variant="link"
            className="gap-1 p-0 h-auto font-semibold text-primary hover:text-primary/90"
            asChild
          >
            <Link href={`/${locale}/register`}>
              {t("login.signUp")}
              <ArrowRight className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
            </Link>
          </Button>
        </div>
      </div>

      {success && (
        <Alert
          variant="success"
          className="border-green-200 bg-green-100/50 dark:border-green-900 dark:bg-green-900/20"
        >
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-600 dark:text-green-400 ms-3">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert
          variant="destructive"
          className="border-destructive/50 bg-destructive/10 text-destructive dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="ml-2 text-sm font-medium">
            {t("common.error")}
          </AlertTitle>
          <AlertDescription className="ml-6 text-xs">
            {error}
            {unverifiedEmail && (
              <div className="mt-2 border-t border-destructive/30 pt-2 dark:border-red-900/50">
                <ResendVerificationDialog
                  email={unverifiedEmail}
                  locale={locale}
                />
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common.password")}</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end">
              <Link
                href={`/${locale}/forgot-password`}
                className="text-sm font-medium text-primary hover:underline"
              >
                {t("login.forgotPassword")}
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full dark:bg-primary dark:hover:bg-primary/90 dark:text-white"
              disabled={isPending}
            >
              {isPending ? t("login.signingIn") : t("login.signIn")}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {t("login.orContinueWith")}
            </span>
          </div>
        </div>

        <GoogleSignInButton locale={locale} />

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {t("login.noAccount")}{" "}
            <Link
              href={`/${locale}/register`}
              className="text-blue-600 hover:underline"
            >
              {t("login.signUp")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
