"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import type { LoginFormValues } from "../validations/login-schema";

export async function login(values: LoginFormValues, locale: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword(values);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect(`/${locale}/dashboard`);
}

export async function consultantLogin(values: LoginFormValues, locale: string) {
  const supabase = await createClient();

  // First, attempt to sign in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (signInError) {
    // Check if the error is due to unverified email
    if (signInError.message.includes("Email not confirmed")) {
      return { error: "Email not confirmed" };
    }
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
  redirect(`/${locale}/dashboard`);
}
