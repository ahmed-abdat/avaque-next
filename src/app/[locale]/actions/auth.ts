"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import type {
  LoginFormValues,
  RegisterFormValues,
} from "@/lib/validations/auth";
import { headers } from "next/headers";
import { UserType } from "@/types/userType";

// Helper to get current locale
function getCurrentLocale(): string {
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";
  const locale = pathname.split("/")[1];
  console.log(locale, "locale from the auth");
  return locale === "fr" ? "fr" : "ar"; // Default to "ar" if not "fr"
}

export async function login(values: LoginFormValues) {
  const supabase = await createClient();
  const locale = getCurrentLocale();

  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect(`/${locale}/`);
}

export async function signup(values: RegisterFormValues) {
  const supabase = await createClient();
  const locale = getCurrentLocale();

  const { error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: {
        full_name: values.fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}${process.env.NEXT_PUBLIC_VERIFY_EMAIL_REDIRECT}?type=email_verification`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect(`/${locale}/verify-email`);
}

export async function signOut() {
  const supabase = await createClient();
  const locale = getCurrentLocale();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect(`/${locale}`);
}

export async function resetPassword(email: string) {
  const supabase = await createClient();
  const locale = getCurrentLocale();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function handleOAuthCallback(code: string) {
  const supabase = await createClient();
  const locale = getCurrentLocale();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    redirect(`/${locale}/login?error=Could not authenticate user`);
  }

  revalidatePath("/", "layout");
  redirect(`/${locale}/dashboard`);
}

export async function resendVerificationEmail(email: string) {
  const supabase = await createClient();
  const locale = getCurrentLocale();

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

export async function isUserExistOnDatabase(email: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  // check if user is consultant
  const { data: consultantData, error: consultantError } = await supabase
    .from("consultant_profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (data?.id) {
    return { id: data.id, type: "student" };
  } else if (consultantData?.id) {
    return { id: consultantData.id, type: "consultant" };
  }
  return null;
}

export async function getUser(): Promise<UserType | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    return null;
  }

  if (user) {
    // try to get the user from the database
    const { data, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", user.email)
      .single();

    if (data) {
      return data;
    }

    if (profileError) {
      const { data: consultantData, error: consultantError } = await supabase
        .from("consultant_profiles")
        .select("*")
        .eq("email", user.email)
        .single();

      if (consultantData) {
        return consultantData;
      }
    }
  }

  return null;
}
