"use client";

import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "./theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

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
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
