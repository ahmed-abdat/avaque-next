"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { resendVerificationEmail } from "@/app/[locale]/actions/auth";
import { Mail, AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ResendVerificationDialogProps {
  email: string;
  locale: string;
  trigger?: React.ReactNode;
}

export function ResendVerificationDialog({
  email,
  locale,
  trigger,
}: ResendVerificationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const t = useTranslations("Auth");
  const isRtl = locale === "ar";

  const handleResend = async () => {
    try {
      setIsSending(true);
      setStatus("idle");
      const result = await resendVerificationEmail(email);

      if (result.error) {
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch (error) {
      setStatus("error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 font-medium hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
            dir={isRtl ? "rtl" : "ltr"}
          >
            <Mail className="h-4 w-4" />
            {t("common.resendVerification.button")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[440px] p-0 gap-0 overflow-hidden border dark:border-gray-800"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Close button */}
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>

        {/* Header with gradient background */}
        <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background dark:from-primary/5 dark:to-background pt-6 pb-4 px-6">
          <div className="absolute inset-0 bg-grid-white/10 dark:bg-grid-slate-700/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
          <DialogHeader className="relative">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary dark:text-primary/90" />
            </div>
            <DialogTitle className="text-center text-xl font-semibold">
              {t("verifyEmail.title")}
            </DialogTitle>
            <DialogDescription className="text-center text-base mt-2 max-w-[320px] mx-auto">
              {t("verifyEmail.description")}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Email display */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-full px-4 py-3 bg-muted/50 dark:bg-muted/20 rounded-lg text-center">
              <p className="text-sm font-medium text-foreground">{email}</p>
            </div>
          </div>

          {/* Status messages */}
          {status === "success" && (
            <Alert
              variant="success"
              className="border-green-200 bg-green-100/50 dark:border-green-900 dark:bg-green-900/20 flex items-center"
            >
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
              <AlertDescription className="text-green-600 dark:text-green-400 ms-3">
                {t("common.resendVerification.success")}
              </AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert
              variant="destructive"
              className="flex items-center dark:border-red-900 dark:bg-red-900/20"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <AlertDescription className="ms-3">
                {t("common.resendVerification.error")}
              </AlertDescription>
            </Alert>
          )}

          {/* Spam note */}
          <Alert
            variant="default"
            className="bg-muted/50 dark:bg-muted/10 border-muted-foreground/20 flex items-start"
          >
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <AlertDescription className="text-sm text-muted-foreground ms-3">
              {t("verifyEmail.spamNote")}
            </AlertDescription>
          </Alert>
        </div>

        {/* Footer with shadow */}
        <div className="px-6 py-4 bg-muted/5 dark:bg-muted/10 border-t dark:border-gray-800">
          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="min-w-[100px] dark:bg-background dark:hover:bg-muted"
              size="lg"
            >
              {t("common.resendVerification.cancel")}
            </Button>
            <Button
              onClick={handleResend}
              disabled={isSending}
              className="gap-2 min-w-[140px] shadow-sm dark:bg-primary dark:hover:bg-primary/90 dark:text-white"
              size="lg"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              {isSending
                ? t("common.resendVerification.sending")
                : t("common.resendVerification.button")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
