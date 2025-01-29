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
import { isUserExistOnDatabase, signup } from "@/app/[locale]/actions/auth";
import { AuthMessage } from "../auth-message";

export function RegisterForm({ locale }: { locale: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const t = useTranslations();
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

      const userExists = await isUserExistOnDatabase(values.email);
      if (userExists?.id && userExists?.type === "student") {
        setError(t("common.errors.emailExists"));
        return;
      } else if (userExists?.id && userExists?.type === "consultant") {
        setError(t("Auth.common.errors.consultantCannotBeStudent"));
        return;
      }

      const result = await signup(values);

      if (result?.error) {
        throw new Error(result.error);
      }

      router.replace(`/${locale}/verify-email`);
    } catch (error) {
      setError(error instanceof Error ? error.message : t("common.messages.error"));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("Auth.register.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("Auth.register.subtitle")}
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
                <FormLabel>{t("common.form.fullName")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("common.form.fullNamePlaceholder")}
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
                    placeholder={t("common.form.password")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {t("Auth.register.hasAccount")}{" "}
              <Link
                href={`/${locale}/login`}
                className="font-medium text-primary hover:underline"
              >
                {t("common.actions.signIn")}
              </Link>
            </p>
          </div>

          <Button
            type="submit"
            className="w-full dark:bg-primary dark:hover:bg-primary/90 dark:text-white"
            disabled={isPending}
          >
            {isPending
              ? t("Auth.register.creatingAccount")
              : t("Auth.register.createAccount")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
