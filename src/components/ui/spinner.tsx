import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: keyof typeof sizesClasses;
  color?: keyof typeof strokeClasses;
  className?: string;
  label?: string;
}

interface SizeProps {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

interface FillProps {
  slate: string;
  blue: string;
  red: string;
  green: string;
  white: string;
}

interface StrokeProps {
  slate: string;
  blue: string;
  red: string;
  green: string;
  white: string;
}

const sizesClasses = {
  xs: "w-4 h-4",
  sm: "w-5 h-5",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-10 h-10",
  "2xl": "w-12 h-12",
} as const;

const fillClasses = {
  slate: "fill-foreground",
  blue: "fill-blue-500",
  red: "fill-red-500",
  green: "fill-emerald-500",
  white: "fill-background",
} as FillProps;

const strokeClasses = {
  slate: "stroke-foreground",
  blue: "stroke-blue-500 dark:stroke-blue-400",
  red: "stroke-red-500 dark:stroke-red-400",
  green: "stroke-emerald-500 dark:stroke-emerald-400",
  white: "stroke-background dark:stroke-white",
  primary: "stroke-primary",
} as const;

export const Spinner = ({
  size = "md",
  color = "primary",
  className,
  label = "Loading...",
}: SpinnerProps) => {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn("flex items-center gap-2", className)}
    >
      <Loader
        className={cn(
          "animate-spin motion-reduce:animate-[spin_1.5s_linear_infinite]",
          sizesClasses[size],
          strokeClasses[color]
        )}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};

export const RoundSpinner = ({
  size = "md",
  color = "primary",
  className,
  label = "Loading...",
}: SpinnerProps) => {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn("flex items-center gap-2", className)}
    >
      <svg
        className={cn(
          "animate-spin motion-reduce:animate-[spin_1.5s_linear_infinite]",
          sizesClasses[size],
          color === "primary" ? "fill-primary" : fillClasses[color]
        )}
        viewBox="3 3 18 18"
      >
        <path
          className="opacity-20"
          d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
        />
        <path d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z" />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
};
