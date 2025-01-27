"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { PasswordInput } from "@/components/ui/password-input";
import { AuthMessage } from "../auth-message";
import {
  ConsultantRegisterValues,
  createRegisterSchema,
} from "@/lib/validations/consultant";
import {
  isConsultantExist,
  consultantSignup,
} from "@/app/[locale]/actions/consultant";
import { cn } from "@/lib/utils";

interface ConsultantRegisterFormProps {
  locale: string;
}

export function ConsultantRegisterForm({
  locale,
}: ConsultantRegisterFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const t = useTranslations("Auth");
  const registerSchema = createRegisterSchema(t);
  const isRtl = locale === "ar";

  const form = useForm<ConsultantRegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      specialization: "",
      shortDescription: "",
      role: "consultant",
    },
  });

  async function onSubmit(values: ConsultantRegisterValues) {
    try {
      setError(null);
      setIsPending(true);

      // Check if consultant already exists
      const consultantExists = await isConsultantExist(values.email);
      // if consultant exists, set error
      if (consultantExists?.id && consultantExists?.type === "consultant") {
        setError(t("common.errors.emailExists"));
        return;
      } else if (consultantExists?.id && consultantExists?.type === "profile") {
        setError(t("consultant.login.errors.profileCannotBeConsultant"));
        return;
      }

      // Create consultant account
      const result = await consultantSignup(values);

      if (result?.error) {
        console.log("result", result);
        throw new Error(result.error);
      }

      // Redirect to email verification page
      router.replace(`/${locale}/verify-email?consultant=true`);
    } catch (error) {
      setError(error instanceof Error ? error.message : t("common.error"));
      console.log("error", error);
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
            {t("consultant.register.title")}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("consultant.register.subtitle")}
        </p>
      </div>

      <AuthMessage type="error" message={error} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("consultant.register.fullName")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("consultant.register.fullNamePlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="specialization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("consultant.register.specialization")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t(
                      "consultant.register.specializationPlaceholder"
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("consultant.register.shortDescription")}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t(
                      "consultant.register.shortDescriptionPlaceholder"
                    )}
                    className={cn(
                      "resize-none",
                      !isRtl && "placeholder:text-sm"
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
            className="w-full bg-primary/90 hover:bg-primary"
            disabled={isPending}
          >
            {isPending ? (
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
            ) : (
              <>
                {t("consultant.register.createAccount")}
                <ArrowRight
                  className={`ml-2 h-4 w-4 ${isRtl ? "rotate-180" : ""}`}
                />
              </>
            )}
          </Button>

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              {t("consultant.register.hasAccount")}{" "}
              <Link
                href={`/${locale}/consultant/login`}
                className="font-medium text-primary hover:underline"
              >
                {t("consultant.register.signIn")}
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
