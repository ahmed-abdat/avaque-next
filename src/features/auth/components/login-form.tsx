"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { ArrowRight, GraduationCap } from "lucide-react";

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
import { PasswordInput } from "@/components/ui/password-input";
import { AuthMessage } from "@/features/auth/components/shared/auth-message";
import { GoogleSignInButton } from "@/features/auth/components/google-sign-in-button";
import { login, consultantLogin } from "../actions/login";
import {
  LoginFormValues,
  createLoginSchema,
} from "@/features/auth/validations/login-schema";

interface LoginFormProps {
  locale: string;
  userType: "user" | "consultant";
}

export function LoginForm({ locale, userType }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const t = useTranslations();
  const tAuth = useTranslations("Auth");
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
    }
  }, [searchParams]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(createLoginSchema(t)),
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

      const result = await (userType === "consultant"
        ? consultantLogin(values, locale)
        : login(values, locale));

      if (!result?.error) {
        // On successful login, check for returnTo URL
        const returnTo = sessionStorage.getItem("returnTo");
        if (returnTo) {
          sessionStorage.removeItem("returnTo");
          router.push(returnTo);
        }
        return;
      }

      // Handle errors
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
        const seconds = errorMessage.match(/\d+/)?.[0] || "60";
        setError(t("common.errors.rateLimit", { seconds }));
      } else if (
        errorMessage.includes("pending approval") &&
        userType === "consultant"
      ) {
        setError(tAuth("consultant.login.errors.pendingApproval"));
      } else if (
        errorMessage.includes("profile not found") &&
        userType === "consultant"
      ) {
        setError(tAuth("consultant.login.errors.profileNotFound"));
      } else {
        setError(t("common.messages.error"));
      }
    } catch (error) {
      console.error(error);
      setError(t("common.messages.error"));
    } finally {
      setIsPending(false);
    }
  }

  // Update the sign up link to preserve the returnTo parameter
  const signUpHref = `/${locale}/${
    userType === "consultant" ? "consultant/" : ""
  }register${
    searchParams?.get("returnTo")
      ? `?returnTo=${searchParams.get("returnTo")}`
      : ""
  }`;

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        {userType === "consultant" ? (
          <div className="flex items-center justify-center space-x-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight">
              {tAuth("consultant.login.title")}
            </h1>
          </div>
        ) : (
          <h1 className="text-2xl font-semibold tracking-tight">
            {tAuth("login.title")}
          </h1>
        )}
        <p className="text-sm text-muted-foreground">
          {userType === "consultant"
            ? tAuth("consultant.login.subtitle")
            : tAuth("login.subtitle")}
        </p>
      </div>

      {!error && !isPending && success && (
        <AuthMessage type="success" message={success} locale={locale} />
      )}
      <AuthMessage
        type="error"
        message={error}
        unverifiedEmail={unverifiedEmail}
        locale={locale}
      />

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

          <div className="flex items-center justify-start">
            <Link
              href={`/${locale}/forgot-password?email=${form.getValues(
                "email"
              )}${userType === "consultant" ? "&consultant=true" : ""}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {userType === "consultant"
                ? tAuth("consultant.login.forgotPassword")
                : tAuth("forgotPassword.title")}
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full dark:bg-primary dark:hover:bg-primary/90 dark:text-white"
            disabled={isPending}
          >
            {isPending ? (
              userType === "consultant" ? (
                tAuth("consultant.login.signingIn")
              ) : (
                tAuth("login.signingIn")
              )
            ) : (
              <>
                {userType === "consultant"
                  ? t("common.actions.signIn")
                  : t("common.actions.signIn")}
                <ArrowRight
                  className={`ml-2 h-4 w-4 ${isRtl ? "rotate-180" : ""}`}
                />
              </>
            )}
          </Button>
        </form>
      </Form>

      {userType === "user" && (
        <>
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
        </>
      )}

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          {userType === "consultant"
            ? tAuth("consultant.register.hasAccount")
            : tAuth("login.noAccount")}{" "}
          <Link
            href={signUpHref}
            className="font-medium text-primary hover:underline"
          >
            {t("common.actions.signUp")}
          </Link>
        </p>
      </div>
    </div>
  );
}
