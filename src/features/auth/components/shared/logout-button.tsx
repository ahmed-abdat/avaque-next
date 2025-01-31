"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { signOut } from "@/features/auth/actions/signout";

export function LogoutButton({ locale }: { locale: string }) {
  const [isPending, setIsPending] = useState(false);
  const t = useTranslations("Auth");

  async function handleLogout() {
    try {
      setIsPending(true);
      await signOut(locale);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Button variant="outline" onClick={handleLogout} disabled={isPending}>
      {isPending ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>{t("logout.signingOut")}</span>
        </div>
      ) : (
        t("logout.signOut")
      )}
    </Button>
  );
}
