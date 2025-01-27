import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ResendVerificationDialog } from "./user/resend-verification-dialog";

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
  if (!message) return null;

  if (type === "success") {
    return (
      <Alert
        variant="success"
        className="border-green-200 bg-green-100/50 dark:border-green-900 dark:bg-green-900/20"
      >
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertDescription className="text-green-600 dark:text-green-400 ms-3">
          {message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert
      variant="destructive"
      className="border-destructive/50 bg-destructive/10 text-destructive dark:text-red-400 dark:bg-red-400/10 dark:border-red-400/50"
    >
      <AlertCircle className="h-4 w-4 dark:text-red-400" />
      <AlertDescription className="ml-2 text-sm font-medium">
        {message}
        {unverifiedEmail && locale && (
          <div className="mt-2 border-t border-destructive/30 pt-2 dark:border-red-900/50">
            <ResendVerificationDialog email={unverifiedEmail} locale={locale} />
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
