"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/local-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("Landing");
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "#features", label: t("nav.features") },
    { href: "#how-it-works", label: t("nav.howItWorks") },
    { href: "#faq", label: t("nav.faq") },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        isScrolled && "shadow-sm"
      )}
    >
      <div className="px-2 sm:px-4 md:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center gap-6">
            <Link
              href={`/${locale}`}
              className="flex items-center space-x-2 transition-transform hover:scale-105"
            >
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                Avaqe
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex md:gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={`/${locale}${item.href}`}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-4 md:flex">
            <LanguageSwitcher />
            <ThemeToggle locale={locale} />
            <div className="flex items-center gap-2">
              <Link href={`/${locale}/login`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="transition-all hover:bg-primary/10"
                >
                  {t("nav.signIn")}
                </Button>
              </Link>
              <Link href={`/${locale}/register`}>
                <Button
                  size="sm"
                  className="shadow-sm transition-all hover:shadow-md"
                >
                  {t("nav.signUp")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={`/${locale}${item.href}`}
                  className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-4 flex items-center gap-4 px-3">
                <LanguageSwitcher />
                <ThemeToggle locale={locale} />
              </div>
              <div className="mt-4 flex flex-col gap-2 px-3">
                <Link href={`/${locale}/login`} className="w-full">
                  <Button
                    variant="ghost"
                    className="w-full justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("nav.signIn")}
                  </Button>
                </Link>
                <Link href={`/${locale}/register`} className="w-full">
                  <Button
                    className="w-full justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("nav.signUp")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
