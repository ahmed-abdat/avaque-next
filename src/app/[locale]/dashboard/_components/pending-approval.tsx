import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock } from "lucide-react";
import { Header } from "@/components/header";
import type { ConsultantProfile } from "@/app/[locale]/consultants/types";
import { cn } from "@/lib/utils";

interface PendingApprovalProps {
  profile: ConsultantProfile;
  locale: string;
}

export function PendingApproval({ profile, locale }: PendingApprovalProps) {
  const t = useTranslations("Dashboard");
  const isRtl = locale === "ar";

  return (
    <div className="flex min-h-screen flex-col" dir={isRtl ? "rtl" : "ltr"}>
      <Header user={profile} isDashboard={true} />
      <main className="flex flex-1 items-center justify-center bg-muted/30 p-4">
        <Card
          className={cn(
            "mx-auto max-w-2xl space-y-8 p-8",
            isRtl ? "text-right" : "text-left"
          )}
        >
          {/* Icon Section */}
          <div className="flex items-center gap-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-transform hover:scale-105">
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-3">
            <h1 className="text-center text-2xl font-bold tracking-tight">
              {t("pendingApproval.title")}
            </h1>
            <p className="text-center text-base text-muted-foreground">
              {t("pendingApproval.description")}
            </p>
          </div>

          {/* Next Steps Section */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div
              className={cn(
                "flex items-start gap-4",
                isRtl && "flex-row-reverse"
              )}
            >
              <CheckCircle2 className="mt-1 h-6 w-6 flex-none text-primary" />
              <div className="space-y-3 flex-1">
                <p className="font-semibold text-lg">
                  {t("pendingApproval.nextSteps")}
                </p>
                <ul
                  className={cn(
                    "space-y-3 text-muted-foreground",
                    isRtl ? "mr-6" : "ml-6"
                  )}
                >
                  <li className="flex items-center gap-2">
                    <span className="inline-block h-1.5 w-1.5 flex-none rounded-full bg-primary/70" />
                    <span>{t("pendingApproval.step1")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="inline-block h-1.5 w-1.5 flex-none rounded-full bg-primary/70" />
                    <span>{t("pendingApproval.step2")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="inline-block h-1.5 w-1.5 flex-none rounded-full bg-primary/70" />
                    <span>{t("pendingApproval.step3")}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
