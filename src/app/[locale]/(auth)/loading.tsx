import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <Image
          src="/logo.png"
          alt="Avaque"
          width={48}
          height={48}
          className="h-12 w-auto animate-pulse"
          priority
        />
        <Spinner size="xl" color="primary" />
      </div>
    </div>
  );
}
