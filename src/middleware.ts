import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/i18n";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

// Routes that don't require authentication
const publicRoutes = [
  "/",
  "/consultants",
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
  "/auth/callback",
  "/consultant/login",
  "/consultant/register",
];

// Create i18n middleware
const i18nMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Get locale from URL (ar or fr)
  const locale = pathname.split("/")[1] || defaultLocale;

  // Handle root path
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  // Handle localized root path (e.g., /ar, /fr)
  if (pathname === `/${locale}`) {
    return i18nMiddleware(request);
  }

  // Check if the route is public (no auth needed)
  const isPublicRoute = publicRoutes.some(
    (route) =>
      pathname.endsWith(`/${locale}${route}`) || pathname.includes("/auth/")
  );

  if (isPublicRoute) {
    // For public routes, just handle i18n
    return i18nMiddleware(request);
  }

  // For protected routes, check auth
  try {
    const supabase = createClient(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // If no session, redirect to login with return URL
      const redirectUrl = new URL(`/${locale}/login`, request.url);
      redirectUrl.searchParams.set("returnTo", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // User is authenticated, proceed with i18n
    return i18nMiddleware(request);
  } catch (error) {
    // console.error("Auth middleware error:", error);
    // On error, redirect to login
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(fr|ar)/:path*"],
};
