"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import {
  getConsultantAvailability,
  updateConsultantAvailability,
} from "../../actions/availability";
import { DAYS, TIME_SLOTS } from "../../constants/availability";
import {
  transformAvailabilityForState,
  transformAvailabilityForApi,
  getDefaultAvailability,
} from "../../utils/availability";
import type { AvailabilityState } from "../../types";
import { validateAvailability } from "../../utils/validation";

interface AvailabilityManagerProps {
  consultantId?: string;
  isRTL: boolean;
}

export function AvailabilityManager({
  consultantId,
  isRTL,
}: AvailabilityManagerProps) {
  const t = useTranslations("ConsultantAvailability");
  const [isLoading, setIsLoading] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityState[]>(
    getDefaultAvailability(DAYS)
  );

  useEffect(() => {
    async function fetchAvailability() {
      if (!consultantId) return;

      const { availability: data, error } = await getConsultantAvailability(
        consultantId
      );

      if (error) {
        toast.error(t("fetchError"));
        return;
      }

      setAvailability(transformAvailabilityForState(data, DAYS));
    }

    fetchAvailability();
  }, [consultantId, t]);

  const handleTimeChange = (
    day: string,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setAvailability((prev) =>
      prev.map((item) =>
        item.day === day ? { ...item, [field]: value } : item
      )
    );
  };

  const handleToggleDay = (day: string) => {
    setAvailability((prev) =>
      prev.map((item) =>
        item.day === day ? { ...item, isEnabled: !item.isEnabled } : item
      )
    );
  };

  const handleSave = async () => {
    if (!consultantId) return;

    const { isValid, errors } = validateAvailability(availability);
    if (!isValid) {
      toast.error(t("invalidSlots"), {
        description: errors.join("\n"),
      });
      return;
    }

    try {
      setIsLoading(true);
      const transformedData = transformAvailabilityForApi(
        availability,
        consultantId
      );

      const { error, success } = await updateConsultantAvailability(
        transformedData
      );

      if (!success || error) {
        throw new Error(error || "Failed to update availability");
      }

      // Refresh the availability data after successful update
      const { availability: freshData, error: fetchError } =
        await getConsultantAvailability(consultantId);

      if (!fetchError && freshData) {
        setAvailability(transformAvailabilityForState(freshData, DAYS));
      }

      toast.success(t("saveSuccess"));
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error instanceof Error ? error.message : t("saveError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="p-2 md:p-6">
        <div className="space-y-6 p-0">

          {availability.map((dayAvail) => (
            <div
              key={dayAvail.day}
              className={cn(
                "flex items-center gap-4 p-4 rounded-lg border",
                dayAvail.isEnabled ? "bg-card" : "bg-muted/50"
              )}
            >
              <div className="flex items-center gap-2">
                <Switch
                  checked={dayAvail.isEnabled}
                  onCheckedChange={() => handleToggleDay(dayAvail.day)}
                  dir="ltr"
                />
                <Label className="capitalize">
                  {t(`days.${dayAvail.day}`)}
                </Label>
              </div>

              {dayAvail.isEnabled && (
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <TimeSelect
                    label={t("startTime")}
                    value={dayAvail.startTime}
                    onChange={(value) =>
                      handleTimeChange(dayAvail.day, "startTime", value)
                    }
                  />
                  <TimeSelect
                    label={t("endTime")}
                    value={dayAvail.endTime}
                    onChange={(value) =>
                      handleTimeChange(dayAvail.day, "endTime", value)
                    }
                  />
                </div>
              )}
            </div>
          ))}

          <Button onClick={handleSave} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2
                  className={cn(
                    "h-4 w-4 animate-spin",
                    isRTL ? "ml-2" : "mr-2"
                  )}
                />
                {t("saving")}
              </>
            ) : (
              t("saveChanges")
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Extracted TimeSelect component for reusability
interface TimeSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function TimeSelect({ label, value, onChange }: TimeSelectProps) {
  return (
    <div>
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {TIME_SLOTS.map((time) => (
            <SelectItem key={time} value={time}>
              {time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
