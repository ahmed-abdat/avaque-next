"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Checked = DropdownMenuCheckboxItemProps["checked"];

export function ThemeToggle({ locale }: { locale: string }) {
  const { theme, setTheme } = useTheme();
  const isRTL = locale === "ar";

  const translations = {
    light: isRTL ? "الوضع النهاري" : "Light",
    dark: isRTL ? "الوضع الليلي" : "Dark",
    system: isRTL ? "وضع النظام" : "System",
    appearance: isRTL ? "المظهر" : "Appearance",
    toggleTheme: isRTL ? "تغيير المظهر" : "Toggle theme"
  };

  const [isLight, setIsLight] = React.useState<Checked>(theme === "light");
  const [isDark, setIsDark] = React.useState<Checked>(theme === "dark");
  const [isSystem, setIsSystem] = React.useState<Checked>(theme === "system");

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setIsLight(newTheme === "light");
    setIsDark(newTheme === "dark");
    setIsSystem(newTheme === "system");
  };

  return (
    <DropdownMenu dir={isRTL ? "rtl" : "ltr"}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">
            {translations.toggleTheme}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align={isRTL ? "end" : "start"} side={isRTL ? "left" : "right"}>
        <DropdownMenuLabel className={isRTL ? "text-right" : "text-left"}>
          {translations.appearance}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={isLight}
          onCheckedChange={() => handleThemeChange("light")}
        >
          {translations.light}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={isDark}
          onCheckedChange={() => handleThemeChange("dark")}
        >
          {translations.dark}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={isSystem}
          onCheckedChange={() => handleThemeChange("system")}
        >
          {translations.system}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
