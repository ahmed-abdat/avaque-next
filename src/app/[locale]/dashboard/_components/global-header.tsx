"use client";

import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConsultantProfile } from "@/types/dashboard";
import LocalSwitcher from "@/components/local-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconLogout } from "@tabler/icons-react";
import Image from "next/image";
import { signOut } from "@/app/[locale]/actions/auth";

interface GlobalHeaderProps {
  profileData: ConsultantProfile | null;
  isRTL: boolean;
}

export function GlobalHeader({ profileData, isRTL }: GlobalHeaderProps) {
  const t = useTranslations("ConsultantDashboard");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <div className={`flex flex-1 items-center justify-between`}>
          {/* Left side / Brand */}
          <div className={`flex items-center gap-6`}>
            {/* Logo */}
            <div className="relative flex items-center">
              <Image
                src="/logo.png"
                alt="Avaque"
                width={32}
                height={32}
                className={isRTL ? "ml-2" : "mr-2"}
                priority
              />
              <span className="hidden font-bold lg:inline-block">Avaque</span>
            </div>
          </div>

          {/* Right side / Actions */}
          <div className={`flex items-center gap-2`}>
            {/* Theme and Language */}
            <div className={`flex items-center gap-2`}>
              <LocalSwitcher />
              <div className="relative">
                <ThemeToggle locale={isRTL ? "ar" : "fr"} />
              </div>
            </div>

            {/* Separator */}
            <div className="mx-2 h-6 w-px bg-border" />

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative size-8 rounded-full"
                >
                  <Avatar className="size-8">
                    <AvatarImage
                      src={profileData?.avatar_url || ""}
                      alt={profileData?.full_name || profileData?.email || ""}
                    />
                    <AvatarFallback className="text-xs">
                      {profileData?.full_name
                        ? profileData.full_name.charAt(0).toUpperCase()
                        : profileData?.email.charAt(0).toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? "start" : "end"}>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                      {profileData?.full_name ||
                        profileData?.email.split("@")[0]}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {profileData?.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {profileData?.specialization}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className={`flex items-center gap-2 text-red-600 dark:text-red-400 ${
                    isRTL ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <IconLogout className="size-4" />
                  <span>{t("navigation.logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
