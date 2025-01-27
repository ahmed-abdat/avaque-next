"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import type { ConsultantRegisterValues } from "@/lib/validations/consultant";
import { headers } from "next/headers";

// Helper to get current locale
function getCurrentLocale(): string {
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";
  const locale = pathname.split("/")[1];
  return locale === "fr" ? "fr" : "ar"; // Default to "ar" if not "fr"
}

export async function consultantSignup(values: ConsultantRegisterValues) {
  const supabase = await createClient();
  const locale = getCurrentLocale();

  // First, sign up the user with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: {
        full_name: values.fullName,
        role: "consultant",
        specialization: values.specialization,
        short_description: values.shortDescription,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}${process.env.NEXT_PUBLIC_VERIFY_EMAIL_REDIRECT}?type=email_verification`,
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  // The trigger function will handle creating the consultant profile
  revalidatePath("/", "layout");
  redirect(`/${locale}/verify-email`);
}

export async function consultantLogin(values: {
  email: string;
  password: string;
}) {
  const supabase = await createClient();
  const locale = getCurrentLocale();

  // First, attempt to sign in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (signInError) {
    return { error: signInError.message };
  }

  // Then check if the user exists and is a consultant
  const { data: consultantProfile, error: consultantProfileError } =
    await supabase
      .from("consultant_profiles")
      .select("id, role, is_approved")
      .eq("email", values.email)
      .single();

  if (consultantProfileError || !consultantProfile) {
    await supabase.auth.signOut();
    return {
      error: "profile not found",
    };
  }


  if (!consultantProfile.is_approved) {
    await supabase.auth.signOut();
    return {
      error: "Your account is pending approval.",
    };
  }

  revalidatePath("/", "layout");
  redirect(`/${locale}/consultant/dashboard`);
}

export async function isConsultantExist(email: string) {
  const supabase = await createClient();

  // First check in profiles table
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .eq("role", "consultant")
    .single();

  if (profileError || !profile) {
    return null;
  }

  // Then check in consultant_profiles table
  const { data: consultantProfile, error: consultantError } = await supabase
    .from("consultant_profiles")
    .select("*")
    .eq("profile_id", profile.id)
    .single();

  if (consultantError || !consultantProfile) {
    return null;
  }

  return consultantProfile;
}
