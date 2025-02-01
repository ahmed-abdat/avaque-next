"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import type {
  RegisterFormValues,
  ConsultantRegisterValues,
} from "../validations/register-schema";
import { headers } from "next/headers";

// Helper to get current locale
function getCurrentLocale(): string {
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";
  const locale = pathname.split("/")[1];
  return locale === "fr" ? "fr" : "ar"; // Default to "ar" if not "fr"
}

export async function isUserExist(email: string) {
  const supabase = await createClient();

  // First check in profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (profile?.id) {
    return { id: profile.id, type: "student" };
  }

  // Then check in consultant_profiles table
  const { data: consultantProfile } = await supabase
    .from("consultant_profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (consultantProfile?.id) {
    return { id: consultantProfile.id, type: "consultant" };
  }

  return null;
}

export async function signupUser(values: RegisterFormValues) {
  const supabase = await createClient();
  const locale = getCurrentLocale();

  const { error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: {
        full_name: values.fullName,
        role: "user",
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

export async function signupConsultant(values: ConsultantRegisterValues) {
  const supabase = await createClient();
  const locale = getCurrentLocale();

  const { error } = await supabase.auth.signUp({
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

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect(`/${locale}/verify-email?consultant=true`);
}
