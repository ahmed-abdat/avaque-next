"use server";

import { createClient } from "@/utils/supabase/client";

export async function resendVerificationEmail(email: string , locale: string) {
    const supabase = await createClient();
  
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}${process.env.NEXT_PUBLIC_VERIFY_EMAIL_REDIRECT}?type=email_verification`,
      },
    });
  
    if (error) {
      return { error: error.message, success: false };
    }
  
    return { success: true, error: null };
  }
  