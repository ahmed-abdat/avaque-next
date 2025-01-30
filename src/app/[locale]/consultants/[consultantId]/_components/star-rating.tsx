"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function StarRating({ value, onChange, disabled }: StarRatingProps) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          className={cn(
            "rounded-md p-1 hover:bg-muted transition-colors",
            disabled && "cursor-not-allowed opacity-50 hover:bg-transparent"
          )}
          onClick={() => !disabled && onChange(rating)}
          disabled={disabled}
        >
          <Star
            className={cn(
              "h-6 w-6",
              rating <= value
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            )}
          />
        </button>
      ))}
    </div>
  );
}
