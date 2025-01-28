"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { locales } from "@/i18n";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { IconLanguage } from "@tabler/icons-react";

type Locale = (typeof locales)[number];

interface LanguageOption {
  value: Locale;
  flag: string;
  label: string;
  nativeLabel: string;
}

const languageOptions: LanguageOption[] = [
  {
    value: "fr",
    flag: "/flags/fr.svg",
    label: "Français",
    nativeLabel: "Français",
  },
  {
    value: "ar",
    flag: "/flags/ar.svg",
    label: "Arabic",
    nativeLabel: "العربية",
  },
];

export default function LocalSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;

  const currentOption = languageOptions.find((l) => l.value === currentLocale);

  const handleLanguageChange = (locale: Locale) => {
    startTransition(() => {
      const newPath = pathname.replace(`/${currentLocale}`, `/${locale}`);
      router.replace(newPath);
    });
  };

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
          {currentOption ? (
            <div className="relative size-5 overflow-hidden rounded-[1px]">
              <Image
                src={currentOption.flag}
                alt={currentOption.label}
                fill
                className="object-cover"
                sizes="20px"
                priority
              />
            </div>
          ) : (
            <IconLanguage className="size-5" />
          )}
          {isPending && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 dark:bg-gray-800/50 rounded-md">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        {languageOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            disabled={currentLocale === option.value || isPending}
            onClick={() => handleLanguageChange(option.value)}
            className="flex items-center gap-2"
          >
            <div className="relative size-4 overflow-hidden rounded-[1px]">
              <Image
                src={option.flag}
                alt={option.label}
                fill
                className="object-cover"
                sizes="16px"
              />
            </div>
            <span>{option.nativeLabel}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
