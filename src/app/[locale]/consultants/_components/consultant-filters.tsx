"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ConsultantWithReviews } from "../types";

interface ConsultantFiltersProps {
  isRtl: boolean;
  onFiltersChange: (filteredConsultants: ConsultantWithReviews[]) => void;
  consultants: ConsultantWithReviews[];
}

export function ConsultantFilters({
  isRtl,
  onFiltersChange,
  consultants,
}: ConsultantFiltersProps) {
  const t = useTranslations("Consultants");

  const [searchQuery, setSearchQuery] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Get unique specializations from consultants
  const specializations = useMemo(() => {
    const uniqueSpecializations = new Set(
      consultants.map((consultant) => consultant.specialization)
    );
    return Array.from(uniqueSpecializations);
  }, [consultants]);

  // Apply filters and sorting
  const applyFilters = () => {
    let filtered = [...consultants];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (consultant) =>
          consultant.full_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          consultant.specialization
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Apply specialization filter
    if (specialization) {
      filtered = filtered.filter(
        (consultant) =>
          consultant.specialization.toLowerCase() ===
          specialization.toLowerCase()
      );
    }

    // Apply sorting
    if (sortBy) {
      filtered.sort((a, b) => {
        if (sortBy === "rating") {
          return (b.rating || 0) - (a.rating || 0);
        }
        if (sortBy === "sessions") {
          return (b.totalSessions || 0) - (a.totalSessions || 0);
        }
        return 0;
      });
    }

    onFiltersChange(filtered);
  };

  // Call applyFilters whenever any filter changes
  useEffect(() => {
    applyFilters();
  }, [searchQuery, specialization, sortBy]);

  return (
    <section className="border-y bg-muted/40">
      <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-6 md:py-8 lg:px-8">
        <div
          className={cn(
            "grid gap-4",
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
            isRtl && "lg:grid-flow-row-dense"
          )}
        >
          <div className="w-full">
            <Input
              placeholder={t("search.placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn("w-full", isRtl && "text-right")}
            />
          </div>
          <Select value={specialization} onValueChange={setSpecialization}>
            <SelectTrigger className={cn(isRtl && "text-right")}>
              <SelectValue placeholder={t("filters.specialization")} />
            </SelectTrigger>
            <SelectContent>
              {specializations.map((spec) => (
                <SelectItem key={spec} value={spec.toLowerCase()}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className={cn(isRtl && "text-right")}>
              <SelectValue placeholder={t("filters.sortBy")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">{t("sort.rating")}</SelectItem>
              <SelectItem value="sessions">{t("sort.sessions")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
