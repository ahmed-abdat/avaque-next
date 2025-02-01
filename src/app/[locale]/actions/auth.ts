"use server";

import { createClient } from "@/utils/supabase/server";
import { UserType } from "@/types/userType";




export async function isUserExiste(email: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

    if (data?.id && !error) {
      return { id: data.id, type: "student" };
    }

  // check if user is consultant
  const { data: consultantData, error: consultantError } = await supabase
    .from("consultant_profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (consultantData?.id && !consultantError) {
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

    if (profileError || !data) {
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
