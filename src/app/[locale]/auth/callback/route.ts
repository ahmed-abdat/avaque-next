import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Force dynamic rendering for the route handler
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";
  const type = requestUrl.searchParams.get("type");

  // Get the locale from the URL path
  const locale = requestUrl.pathname.split("/")[1] || "en";

  if (!code) {
    return NextResponse.redirect(
      new URL(`/${locale}/login?error=No code provided`, request.url)
    );
  }

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(
        new URL(`/${locale}/login?error=${error.message}`, request.url)
      );
    }

    // If this is email verification, check user role and redirect accordingly
    if (type === "email_verification") {
      // Get the user's session to check their role
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userRole = session?.user?.user_metadata?.role;

      // Determine the redirect URL based on the user's role
      const redirectUrl =
        userRole === "consultant"
          ? `/${locale}/consultant/login?verified=true`
          : `/${locale}/login?verified=true`;

      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // For other auth callbacks (like OAuth), redirect to the next URL
    return NextResponse.redirect(new URL(`/${locale}${next}`, request.url));
  } catch (error) {
    console.error("Unknown error in auth callback:", error);
    return NextResponse.redirect(
      new URL(`/${locale}/login?error=Unknown error occurred`, request.url)
    );
  }
}
