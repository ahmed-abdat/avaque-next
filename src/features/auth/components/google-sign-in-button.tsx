"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";

export function GoogleSignInButton({ locale }: { locale: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("Auth");

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get the return URL if it exists
      const returnTo = searchParams.get("returnTo") || "/dashboard";

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${
            process.env.NEXT_PUBLIC_SITE_URL
          }/${locale}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        console.error("❌ Google sign-in error:", error);
        throw error;
      }
    } catch (error) {
      console.error("❌ Error signing in with Google:", error);
      setError(error instanceof Error ? error.message : t("common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={signInWithGoogle}
        className="w-full bg-background hover:bg-muted text-muted-foreground font-normal"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-primary/30" />
            <span>{t("login.signingIn")}</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span>{t("login.googleSignIn")}</span>
            <FcGoogle className="h-5 w-5" />
          </div>
        )}
      </Button>
      {error && <p className="text-sm text-destructive text-center">{error}</p>}
    </div>
  );
}
