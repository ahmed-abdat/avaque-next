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
import { AuthMessage } from "./shared/auth-message";
import {
  RegisterFormValues,
  ConsultantRegisterValues,
  createRegisterSchema,
  createConsultantRegisterSchema,
} from "../validations/register-schema";
import { isUserExist, signupUser, signupConsultant } from "@/features/auth/actions/signup";
import { cn } from "@/lib/utils";

interface RegisterFormProps {
  locale: string;
  userType: "user" | "consultant";
}

export function RegisterForm({ locale, userType }: RegisterFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const t = useTranslations();
  const tAuth = useTranslations("Auth");
  const isRtl = locale === "ar";

  const isConsultant = userType === "consultant";
  const schema = isConsultant
    ? createConsultantRegisterSchema(t)
    : createRegisterSchema(t);

  const form = useForm<RegisterFormValues | ConsultantRegisterValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      ...(isConsultant && {
        specialization: "",
        shortDescription: "",
        role: "consultant" as const,
      }),
    },
  });

  async function onSubmit(
    values: RegisterFormValues | ConsultantRegisterValues
  ) {
    try {
      setError(null);
      setIsPending(true);

      const userExists = await isUserExist(values.email);

      if (isConsultant) {
        if (userExists?.id && userExists?.type === "consultant") {
          setError(t("common.errors.emailExists"));
          return;
        } else if (userExists?.id && userExists?.type === "student") {
          setError(tAuth("consultant.login.errors.profileCannotBeConsultant"));
          return;
        }

        const result = await signupConsultant(
          values as ConsultantRegisterValues
        );
        if (result?.error) throw new Error(result.error);
      } else {
        if (userExists?.id && userExists?.type === "student") {
          setError(t("common.errors.emailExists"));
          return;
        } else if (userExists?.id && userExists?.type === "consultant") {
          setError(tAuth("common.errors.consultantCannotBeStudent"));
          return;
        }

        const result = await signupUser(values as RegisterFormValues);
        if (result?.error) throw new Error(result.error);
      }

      router.replace(
        `/${locale}/verify-email${isConsultant ? "?consultant=true" : ""}`
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : t("common.error"));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        {isConsultant ? (
          <div className="flex items-center justify-center space-x-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight">
              {tAuth("consultant.register.title")}
            </h1>
          </div>
        ) : (
          <h1 className="text-2xl font-semibold tracking-tight">
            {tAuth("register.title")}
          </h1>
        )}
        <p className="text-sm text-muted-foreground">
          {isConsultant
            ? tAuth("consultant.register.subtitle")
            : tAuth("register.subtitle")}
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
                <FormLabel>
                  {isConsultant
                    ? tAuth("consultant.register.fullName")
                    : tAuth("register.fullName")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      isConsultant
                        ? tAuth("consultant.register.fullNamePlaceholder")
                        : tAuth("register.fullNamePlaceholder")
                    }
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
                  <PasswordInput
                    placeholder={tAuth("register.createPassword")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isConsultant && (
            <>
              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {tAuth("consultant.register.specialization")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={tAuth(
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
                      {tAuth("consultant.register.shortDescription")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={tAuth(
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
            </>
          )}

          <Button
            type="submit"
            className="w-full bg-primary/90 hover:bg-primary"
            disabled={isPending}
          >
            {isPending ? (
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
            ) : (
              <>
                {isConsultant
                  ? tAuth("consultant.register.createAccount")
                  : tAuth("register.createAccount")}
                <ArrowRight
                  className={`ml-2 h-4 w-4 ${isRtl ? "rotate-180" : ""}`}
                />
              </>
            )}
          </Button>

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              {isConsultant
                ? tAuth("consultant.register.hasAccount")
                : tAuth("register.hasAccount")}{" "}
              <Link
                href={`/${locale}${isConsultant ? "/consultant" : ""}/login`}
                className="font-medium text-primary hover:underline"
              >
                {isConsultant
                  ? tAuth("consultant.register.signIn")
                  : tAuth("register.signIn")}
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
