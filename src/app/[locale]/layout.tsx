import type { Metadata } from "next";
import { tajawal, roboto } from "@/app/font";
import { locales } from "@/i18n";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { RootProvider } from "@/components/providers/global-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Avaque",
  description: "Learning Management System",
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Ensure that the incoming `locale` is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body
        className={`${
          locale === "ar" ? tajawal.variable : roboto.variable
        } font-sans min-h-screen antialiased bg-background text-foreground`}
      >
        <RootProvider
          locale={locale}
          messages={messages}
        >
            {children}
        </RootProvider>
      </body>
    </html>
  );
}
