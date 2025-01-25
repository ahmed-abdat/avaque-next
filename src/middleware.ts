import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales: ['fr', 'ar'],
 
  // Used when no locale matches
  defaultLocale: 'ar',
  // localePrefix : "as-needed"
});
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(fr|ar)/:path*']
};