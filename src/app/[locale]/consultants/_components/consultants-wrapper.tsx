"use client";

import { useState, useEffect } from "react";
import { ConsultantWithReviews } from "../types";
import { ConsultantFilters } from "./consultant-filters";
import { ConsultantCard } from "./consultant-card";
import { HeroSection } from "./hero-section";
import { cn } from "@/lib/utils";

interface ConsultantsWrapperProps {
  consultants: ConsultantWithReviews[];
  locale: string;
  isRtl: boolean;
}

export function ConsultantsWrapper({
  consultants,
  locale,
  isRtl,
}: ConsultantsWrapperProps) {
  // Ensure consultants is always an array
  const initialConsultants = Array.isArray(consultants) ? consultants : [];
  const [filteredConsultants, setFilteredConsultants] =
    useState<ConsultantWithReviews[]>(initialConsultants);

  // Update filtered consultants when the initial consultants change
  useEffect(() => {
    setFilteredConsultants(initialConsultants);
  }, [initialConsultants]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection isRtl={isRtl} />

      {/* Filters Section */}
      <ConsultantFilters
        consultants={initialConsultants}
        onFiltersChange={setFilteredConsultants}
        isRtl={isRtl}
      />

      {/* Consultants Grid */}
      <section className="mx-auto max-w-[1400px] px-4 py-12 md:px-6 lg:px-8">
        {!filteredConsultants?.length ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-lg border bg-muted/40">
            <div className="text-center">
              <h3 className="text-lg font-medium">No consultants found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your filters or search terms
              </p>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
              isRtl && "lg:grid-flow-row-dense"
            )}
          >
            {filteredConsultants.map((consultant) => (
              <ConsultantCard
                key={consultant.id}
                consultant={consultant}
                locale={locale}
                isRtl={isRtl}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
