"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

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
import { AuthMessage } from "../auth-message";

export function LoginForm({ locale }: { locale: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const t = useTranslations();
  const tAuth = useTranslations("Auth");
  const loginSchema = createLoginSchema(t);
  const isRtl = locale === "ar";

  // Check for verification success message and errors
  useEffect(() => {
    if (searchParams?.get("verified") === "true") {
      setSuccess(tAuth("verifyEmail.success"));
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
        setError(tAuth("verifyEmail.errors.linkExpired"));
      } else if (urlError === "No code provided") {
        setError(tAuth("verifyEmail.errors.invalidLink"));
      } else if (errorCode === "access_denied") {
        setError(tAuth("verifyEmail.errors.accessDenied"));
      } else {
        setError(t("common.messages.error"));
      }
    }
  }, [searchParams, t, tAuth]);

  // Store returnTo URL in session storage on component mount
  useEffect(() => {
    const returnTo = searchParams?.get("returnTo");
    if (returnTo) {
      sessionStorage.setItem("returnTo", returnTo);
      console.log("returnTo", returnTo);
    }
  }, [searchParams]);

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

      if (!result?.error) {
        // On successful login, check for returnTo URL
        const returnTo = sessionStorage.getItem("returnTo");
        if (returnTo) {
          sessionStorage.removeItem("returnTo"); // Clean up
          router.push(returnTo);
        }
      }

      if (result?.error) {
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
          setError(t("common.messages.error"));
        }
      }
    } catch (error) {
      console.error(error);
      setError(t("common.messages.error"));
    } finally {
      setIsPending(false);
    }
  }

  // Update the sign up link to preserve the returnTo parameter
  const signUpHref = searchParams?.get("returnTo")
    ? `/${locale}/register?returnTo=${searchParams.get("returnTo")}`
    : `/${locale}/register`;

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {tAuth("login.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {tAuth("login.subtitle")}
        </p>

        {/* Sign up link */}
        <div className="mt-2 text-sm">
          {tAuth("login.noAccount")}{" "}
          <Button
            variant="link"
            className="gap-1 p-0 h-auto font-semibold text-primary hover:text-primary/90"
            asChild
          >
            <Link href={signUpHref}>
              {tAuth("login.signUp")}
              <ArrowRight
                className="h-4 w-4 inline-block"
                style={{ transform: isRtl ? "rotate(180deg)" : "none" }}
              />
            </Link>
          </Button>
        </div>
      </div>

      <AuthMessage type="success" message={success} />

      <AuthMessage
        type="error"
        message={error}
        unverifiedEmail={unverifiedEmail}
        locale={locale}
      />

      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common.form.email")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t("common.form.emailPlaceholder")}
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
                  <FormLabel>{t("common.form.password")}</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end">
              <Link
                href={`/${locale}/forgot-password?email=${form.getValues(
                  "email"
                )}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                {tAuth("login.forgotPassword")}
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full dark:bg-primary dark:hover:bg-primary/90 dark:text-white"
              disabled={isPending}
            >
              {isPending ? tAuth("login.signingIn") : tAuth("login.signIn")}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {tAuth("login.orContinueWith")}
            </span>
          </div>
        </div>

        <GoogleSignInButton locale={locale} />

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {tAuth("login.noAccount")}{" "}
            <Link href={signUpHref} className="text-blue-600 hover:underline">
              {tAuth("login.signUp")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
