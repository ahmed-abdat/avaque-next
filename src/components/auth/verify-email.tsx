"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Mail, ArrowLeft, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthMessage } from "./auth-message";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

interface VerifyEmailFormProps {
  locale: string;
}

export function VerifyEmailForm({ locale }: VerifyEmailFormProps) {
  const t = useTranslations("Auth");
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const isConsultant = searchParams.get("consultant") === "true";

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="w-full max-w-md">
        {/* Email Icon with Animated Background */}
        <div className="relative mx-auto mb-6 flex h-[90px] w-[90px] items-center justify-center">
          <div className="absolute inset-0 animate-pulse rounded-full bg-primary/10" />
          <div className="absolute inset-2 rounded-full bg-primary/20" />
          <Mail className="relative h-10 w-10 text-primary" strokeWidth={1.5} />
        </div>

        {/* Title and Description */}
        <div className="text-center">
          <h1 className="text-xl font-semibold tracking-tight">
            {t("verifyEmail.title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("verifyEmail.description")}
          </p>
        </div>

        {/* Error Message */}
        <div className="mt-4">
          <AuthMessage type="error" message={error} />
        </div>

        {/* Email Steps */}
        <div className="mt-6 space-y-3">
          <div className="overflow-hidden rounded-lg border bg-card">
            <div className="flex items-center gap-3 border-b p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Inbox className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">
                  1. {t("verifyEmail.checkInbox")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("verifyEmail.checkInboxDesc")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">
                  2. {t("verifyEmail.clickLink")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("verifyEmail.clickLinkDesc")}
                </p>
              </div>
            </div>
          </div>

          {/* Spam Note */}
          <Alert
            variant="default"
            className="flex items-start bg-muted/50 py-2"
          >
            <AlertDescription className="text-xs text-muted-foreground">
              {t("verifyEmail.spamNote")}
            </AlertDescription>
          </Alert>
        </div>

        {/* Actions */}
        <div className="mt-6">
          <Button asChild variant="outline" className="w-full gap-2 text-sm">
            <Link href={`/${locale}${isConsultant ? "/consultant" : ""}/login`}>
              <ArrowLeft className="h-4 w-4" />
              {t("resetPassword.backToLogin")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
