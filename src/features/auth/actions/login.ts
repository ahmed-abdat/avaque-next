"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function handleLogin({
  values,
  userType,
  onSuccess,
  onError,
}: {
  values: { email: string; password: string };
  userType: "user" | "consultant";
  onSuccess: () => void;
  onError: (error: string) => void;
}) {

  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signInWithPassword(values);

    if (error) {
      if (error.message.includes("Email not confirmed")) {
        return onError("Email not confirmed");
      }
      return onError(error.message);
    }

    if (userType === "consultant") {
      const { data } = await supabase
        .from("consultant_profiles")
        .select("is_approved")
        .eq("email", values.email)
        .single();

      if (!data?.is_approved) {
        await supabase.auth.signOut();
        return onError("pending approval");
      }
    }

    revalidatePath("/", "layout");
    onSuccess();
  } catch (error) {
    onError(error instanceof Error ? error.message : "Unknown error");
  }
}
