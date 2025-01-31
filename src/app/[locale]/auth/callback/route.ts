import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Force dynamic rendering for the route handler
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/";
  const type = requestUrl.searchParams.get("type");
  const returnTo = requestUrl.searchParams.get("returnTo");

  // Get the locale from the URL path
  const locale = requestUrl.pathname.split("/")[1] || "ar";

  if (!code) {
    return NextResponse.redirect(
      new URL(`/${locale}/login?error=No code provided`, request.url)
    );
  }

  try {
    const supabase = await createClient();
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
        data: { user },
      } = await supabase.auth.getUser();
      const userRole = user?.user_metadata?.role;


      if (userRole === "consultant") {
        return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
      }

      // If returnTo is provided, use it for the redirect
      if (returnTo) {
        const redirectUrl = `${returnTo}?verified=true`;
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }

      // Otherwise, use the default role-based redirect
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
