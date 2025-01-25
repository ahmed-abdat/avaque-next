"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { locales } from "@/i18n";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Locale = (typeof locales)[number];

interface LanguageOption {
  value: Locale;
  flag: string;
  label: string;
}

const languageOptions: LanguageOption[] = [
  {
    value: "fr",
    flag: "/flags/fr.svg",
    label: "Changer en français",
  },
  {
    value: "ar",
    flag: "/flags/ar.svg",
    label: "التغيير إلى العربية",
  },
];

export default function LocalSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;

  // Get the next language option to display its flag
  const nextLocale = currentLocale === "ar" ? "fr" : "ar";
  const nextOption = languageOptions.find((l) => l.value === nextLocale);

  const handleLanguageChange = () => {
    startTransition(() => {
      // Extract the path after the locale
      const newPath = pathname.replace(`/${currentLocale}`, `/${nextLocale}`);
      router.replace(newPath);
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "size-10 flex items-center justify-center relative",
        isPending && "opacity-50 cursor-not-allowed"
      )}
      onClick={handleLanguageChange}
      disabled={isPending}
      aria-label={nextOption?.label}
      title={nextOption?.label}
    >
      <div className="relative size-5 overflow-hidden rounded-[1px]">
        <Image
          src={nextOption?.flag || ""}
          alt={nextOption?.label || ""}
          fill
          className="object-cover"
          sizes="20px"
          priority
        />
      </div>
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 dark:bg-gray-800/50 rounded-md">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
        </div>
      )}
    </Button>
  );
}
