"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ThemeOption {
  value: string;
  icon: React.ReactNode;
  label: {
    ar: string;
    fr: string;
  };
}

const themeOptions: ThemeOption[] = [
  {
    value: "light",
    icon: <Sun className="size-4" />,
    label: {
      ar: "الوضع النهاري",
      fr: "Lumineux",
    },
  },
  {
    value: "dark",
    icon: <Moon className="size-4" />,
    label: {
      ar: "الوضع الليلي",
      fr: "Sombre",
    },
  },
  {
    value: "system",
    icon: <Sun className="size-4" />,
    label: {
      ar: "وضع النظام",
      fr: "Système",
    },
  },
];

export function ThemeToggle({ locale }: { locale: string }) {
  const { theme, setTheme } = useTheme();
  const isRTL = locale === "ar";
  const [mounted, setMounted] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme || "system";
  const currentOption = themeOptions.find((t) => t.value === currentTheme);

  const handleThemeChange = (newTheme: string) => {
    setIsPending(true);
    setTheme(newTheme);
    setTimeout(() => setIsPending(false), 300);
  };

  // Prevent hydration mismatch by not rendering anything until mounted
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="size-8">
        <span className="sr-only">Loading theme</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "size-8 flex items-center justify-center relative",
            isPending && "opacity-50 cursor-not-allowed"
          )}
          disabled={isPending}
        >
          {currentOption ? currentOption.icon : <Sun className="size-4" />}
          {isPending && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 dark:bg-gray-800/50 rounded-md">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
            </div>
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        {themeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            disabled={currentTheme === option.value || isPending}
            onClick={() => handleThemeChange(option.value)}
            className={cn(
              "flex items-center gap-2",
              isRTL && "flex-row-reverse"
            )}
          >
            {option.icon}
            <span>{option.label[locale as keyof typeof option.label]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
