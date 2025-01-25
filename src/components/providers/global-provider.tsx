"use client";

import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "./theme-provider";

interface RootProviderProps {
  children: React.ReactNode;
  locale: string;
  messages: any;
}

export function RootProvider({
  children,
  locale,
  messages,
}: RootProviderProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone="Africa/Tunis"
      >
          {children}
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
