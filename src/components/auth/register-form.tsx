"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { PasswordInput } from "@/components/ui/password-input";
import {
  RegisterFormValues,
  createRegisterSchema,
} from "@/lib/validations/auth";
import { signup } from "@/app/[locale]/actions/auth";

export function RegisterForm({ locale }: { locale: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const t = useTranslations("Auth");
  const registerSchema = createRegisterSchema(t);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    try {
      setError(null);
      setIsPending(true);
      const result = await signup(values);

      if (result?.error) {
        throw new Error(result.error);
      }

      router.replace(`/${locale}/verify-email`);
    } catch (error) {
      setError(error instanceof Error ? error.message : t("common.error"));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("register.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("register.subtitle")}
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
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("register.fullName")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("register.fullNamePlaceholder")}
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

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {t("register.hasAccount")}{" "}
              <Link
                href={`/${locale}/login`}
                className="font-medium text-primary hover:underline"
              >
                {t("register.signIn")}
              </Link>
            </p>
          </div>

          <Button
            type="submit"
            className="w-full dark:bg-primary dark:hover:bg-primary/90 dark:text-white"
            disabled={isPending}
          >
            {isPending
              ? t("register.creatingAccount")
              : t("register.createAccount")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
