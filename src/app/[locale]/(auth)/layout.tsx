import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left side - Auth form */}
      <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-background">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Image
            src="/logo.png"
            alt="Avaque"
            width={48}
            height={48}
            className="mx-auto h-12 w-auto"
            priority
          />
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[400px]">
          <div className="bg-card px-6 py-8 shadow-sm ring-1 ring-border/5 sm:rounded-xl sm:px-12">
            {children}
          </div>
        </div>
      </div>

      {/* Right side - Background pattern */}
      <div className="hidden lg:block relative bg-muted">
        <div className="absolute inset-0 bg-grid-black/[0.05] [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-primary/10 via-primary/5 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>
    </div>
  );
}
