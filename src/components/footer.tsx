"use client";

import { useTranslations } from "next-intl";
import {
  GraduationCap,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Footer() {
  const t = useTranslations("Footer");
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const isRtl = locale === "ar";

  return (
    <footer className="relative border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

      <div className="px-2 sm:px-4 md:px-8 py-12 md:py-16 lg:py-20">
        <div
          className={cn(
            "grid gap-8 md:grid-cols-2 lg:grid-cols-4",
            isRtl && "text-right"
          )}
        >
          {/* Brand Section */}
          <div className="space-y-4">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center space-x-2 rtl:space-x-reverse transition-transform hover:scale-105"
            >
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                Avaqe
              </span>
            </Link>
            <p className="text-muted-foreground max-w-xs">{t("description")}</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">
              {t("quickLinks.title")}
            </h3>
            <ul className="space-y-2">
              {[
                { href: "#features", label: t("quickLinks.features") },
                { href: "#how-it-works", label: t("quickLinks.howItWorks") },
                { href: "#faq", label: t("quickLinks.faq") },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">
              {t("contact.title")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:info@avaqe.com"
                  className="inline-flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground transition-colors hover:text-primary"
                >
                  <Mail className="h-4 w-4" />
                  <span>info@avaqe.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+966XXXXXXXX"
                  className="inline-flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground transition-colors hover:text-primary"
                >
                  <Phone className="h-4 w-4" />
                  <span>+966 XX XXX XXXX</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">
              {t("social.title")}
            </h3>
            <div
              className={cn(
                "flex gap-4",
                isRtl ? "justify-end md:justify-start" : "justify-start"
              )}
            >
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
              ].map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-primary/10 p-2 text-primary transition-all hover:bg-primary/20 hover:scale-110"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t pt-8 text-center text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Avaqe. {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
