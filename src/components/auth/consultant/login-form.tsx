"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
import { AuthMessage } from "../auth-message";
import {
  ConsultantLoginValues,
  createLoginSchema,
} from "@/lib/validations/consultant";
import { consultantLogin } from "@/app/[locale]/actions/consultant";

interface ConsultantLoginFormProps {
  locale: string;
}

export function ConsultantLoginForm({ locale }: ConsultantLoginFormProps) {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
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
    if (urlError) {
      setError(t("common.error"));
    }
  }, [searchParams, t]);

  const form = useForm<ConsultantLoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: ConsultantLoginValues) {
    try {
      setError(null);
      setUnverifiedEmail(null);
      setIsPending(true);

      const result = await consultantLogin(values);

      if (result?.error) {
        // Map error messages to translations
        if (result.error.includes("Invalid login credentials")) {
          setError(t("common.errors.invalidCredentials"));
        } else if (result.error.includes("Email not confirmed")) {
          setError(t("common.errors.emailNotConfirmed"));
          setUnverifiedEmail(values.email);
        } else if (result.error.includes("pending approval")) {
          setError(t("consultant.login.errors.pendingApproval"));
        } else if (result.error.includes("profile not found")) {
          setError(t("consultant.login.errors.profileNotFound"));
        } else {
          setError(t("common.error"));
        }
        return;
      }

      // Successful login will redirect to dashboard via the action
    } catch (error) {
      console.error("Login error:", error);
      setError(t("common.error"));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <div className="flex items-center justify-center space-x-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("consultant.login.title")}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("consultant.login.subtitle")}
        </p>
      </div>

      <AuthMessage
        type="error"
        message={error}
        unverifiedEmail={unverifiedEmail}
        locale={locale}
      />
      {!error && !isPending && success && (
        <AuthMessage type="success" message={success} />
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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common.password")}</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={t("register.createPassword")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <Link
              href={`/${locale}/forgot-password?email=${form.getValues(
                "email"
              )}&consultant=true`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {t("consultant.login.forgotPassword")}
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary/90 hover:bg-primary"
            disabled={isPending}
          >
            {isPending ? (
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
            ) : (
              <>
                {t("consultant.login.signIn")}
                <ArrowRight
                  className={`ml-2 h-4 w-4 ${isRtl ? "rotate-180" : ""}`}
                />
              </>
            )}
          </Button>

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              {t("consultant.login.noAccount")}{" "}
              <Link
                href={`/${locale}/consultant/register`}
                className="font-medium text-primary hover:underline"
              >
                {t("consultant.login.signUp")}
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
