"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/local-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { UserType } from "@/types/userType";

interface HeaderProps {
  user: UserType | null;
  isDashboard?: boolean;
}

export function Header({ user, isDashboard }: HeaderProps) {
  const t = useTranslations("Landing.nav");
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const navItems = [
    { href: "#features", label: t("features") },
    { href: "#how-it-works", label: t("howItWorks") },
    { href: "#faq", label: t("faq") },
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

            {/* Desktop Navigation - Only show if not in dashboard */}
            {!isDashboard && (
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
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-4 md:flex">
            <LanguageSwitcher />
            <ThemeToggle locale={locale} />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user?.avatar_url ?? ""}
                        alt={user?.full_name ?? "User"}
                      />
                      <AvatarFallback>
                        {user?.full_name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("") || user?.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  {user && (
                    <>
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">
                            {user.full_name || user.email?.split("@")[0]}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {user?.role === "consultant" && !isDashboard && (
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/${locale}/dashboard`}
                        className="flex items-center"
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>{t("dashboard")}</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("signOut")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              !isDashboard && (
                <div className="flex items-center gap-2">
                  <Link href={`/${locale}/login`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="transition-all hover:bg-primary/10"
                    >
                      {t("signIn")}
                    </Button>
                  </Link>
                  <Link href={`/${locale}/register`}>
                    <Button
                      size="sm"
                      className="shadow-sm transition-all hover:shadow-md"
                    >
                      {t("signUp")}
                    </Button>
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Mobile Menu Button - Only show if not in dashboard */}
          {!isDashboard && (
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
          )}
        </div>

        {/* Mobile Menu - Only show if not in dashboard */}
        {!isDashboard && isMenuOpen && (
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
              {user ? (
                <div className="mt-4 flex flex-col gap-2 px-3">
                  {user.role === "consultant" && !isDashboard && (
                    <Link href={`/${locale}/dashboard`} className="w-full">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        {t("dashboard")}
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600"
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("signOut")}
                  </Button>
                </div>
              ) : (
                <div className="mt-4 flex flex-col gap-2 px-3">
                  <Link href={`/${locale}/login`} className="w-full">
                    <Button
                      variant="ghost"
                      className="w-full justify-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("signIn")}
                    </Button>
                  </Link>
                  <Link href={`/${locale}/register`} className="w-full">
                    <Button
                      className="w-full justify-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("signUp")}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
