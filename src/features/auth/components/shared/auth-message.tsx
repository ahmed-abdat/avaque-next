"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { resendVerificationEmail } from "@/app/[locale]/actions/auth";

interface AuthMessageProps {
  type: "error" | "success";
  message: string | null;
  unverifiedEmail?: string | null;
  locale?: string;
}

export function AuthMessage({
  type,
  message,
  unverifiedEmail,
  locale,
}: AuthMessageProps) {
  const t = useTranslations();
  const [isResending, setIsResending] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);

  if (!message && !unverifiedEmail) return null;

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;

    try {
      setIsResending(true);
      setResendError(null);
      setResendSuccess(false);

      const result = await resendVerificationEmail(unverifiedEmail);

      if (result.error) {
        setResendError(t("common.errors.resendVerification"));
      } else {
        setResendSuccess(true);
      }
    } catch (error) {
      console.error("Error resending verification email:", error);
      setResendError(t("common.errors.resendVerification"));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Alert
      variant={type === "error" ? "destructive" : "default"}
      className={type === "success" ? "border-green-500" : ""}
    >
      {type === "error" ? (
        <AlertCircle className="h-4 w-4" />
      ) : (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      )}
      <AlertDescription className="flex flex-col gap-2">
        <span>{message}</span>
        {unverifiedEmail && (
          <div className="flex flex-col gap-2">
            <span>{t("common.errors.verifyEmailPrompt")}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResendVerification}
              disabled={isResending || resendSuccess}
            >
              {isResending
                ? t("common.actions.resending")
                : resendSuccess
                ? t("common.actions.resent")
                : t("common.actions.resend")}
            </Button>
            {resendError && (
              <span className="text-sm text-destructive">{resendError}</span>
            )}
            {resendSuccess && (
              <span className="text-sm text-green-500">
                {t("common.messages.verificationEmailSent")}
              </span>
            )}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
