import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  isRtl: boolean;
}

export function HeroSection({ isRtl }: HeroSectionProps) {
  const t = useTranslations("Consultants");

  return (
    <section className="relative bg-muted/40 py-12 md:py-16 lg:py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-background" />

      <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
        <div className={cn("max-w-2xl space-y-4", isRtl && "text-right")}>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {t("title")}
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl md:text-2xl">
            {t("description")}
          </p>
        </div>
      </div>
    </section>
  );
}
