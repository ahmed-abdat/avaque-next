"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  createBooking,
  getUserActiveBookings,
} from "@/app/[locale]/actions/bookings";
import {
  getConsultantAvailability,
  checkTimeSlotAvailability,
} from "@/features/dashboards/consultants/actions/availability";
import { transformAvailabilityForState } from "@/features/dashboards/consultants/utils/availability";
import { DAYS } from "@/features/dashboards/consultants/constants/availability";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ConsultantProfile } from "../../types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import type {
  AvailabilityState,
  DayOfWeek,
} from "@/features/dashboards/consultants/types";

interface BookingFormProps {
  consultant: ConsultantProfile;
}

interface Booking {
  id: string;
  consultant_id: string;
  scheduled_time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export function BookingForm({ consultant }: BookingFormProps) {
  const t = useTranslations("Consultants");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [hasActiveBooking, setHasActiveBooking] = useState(false);
  const [existingBookings, setExistingBookings] = useState<Date[]>([]);
  const [availability, setAvailability] = useState<AvailabilityState[]>([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(true);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  
  // New state to cache available slots per selected date (keyed by date string)
  const [availableSlotsCache, setAvailableSlotsCache] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const checkActiveBookings = async () => {
      const { bookings, error } = await getUserActiveBookings(consultant.id);
      if (error) {
        console.error("Error checking active bookings:", error);
        return;
      }

      setHasActiveBooking(
        bookings.some((b: Booking) => b.consultant_id === consultant.id)
      );
      setExistingBookings(
        bookings.map((b: Booking) => new Date(b.scheduled_time))
      );
    };

    checkActiveBookings();
  }, [consultant.id]);

  useEffect(() => {
    async function fetchAvailability() {
      const { availability: data, error } = await getConsultantAvailability(
        consultant.id
      );
      if (!error && data) {
        const transformedData = transformAvailabilityForState(data, DAYS);
        console.log("Raw Consultant Availability:", {
          consultantId: consultant.id,
          rawData: data,
          transformedData,
          error,
        });
        setAvailability(transformedData);
      } else {
        console.error("Error fetching availability:", error);
      }
      setIsLoadingAvailability(false);
    }
    fetchAvailability();
  }, [consultant.id]);

  const getAvailableTimeSlots = (date: Date) => {
    const dayIndex = date.getDay();
    const dayOfWeek = DAYS[dayIndex] as DayOfWeek;
    const dayAvailability = availability.find((a) => a.day === dayOfWeek);

    console.log("Getting Time Slots for Day:", {
      date,
      dayIndex,
      dayOfWeek,
      dayAvailability,
      allAvailability: availability,
    });

    if (!dayAvailability?.isEnabled) {
      console.log("Day is not enabled or no availability found");
      return [];
    }

    const [startHour] = dayAvailability.startTime.split(":");
    const [endHour] = dayAvailability.endTime.split(":");

    console.log("Time Range:", {
      startHour,
      endHour,
      startTime: dayAvailability.startTime,
      endTime: dayAvailability.endTime,
      dayOfWeek,
      dayIndex,
    });

    const slots = Array.from(
      { length: parseInt(endHour) - parseInt(startHour) },
      (_, i) => {
        const hour = parseInt(startHour) + i;
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12}:00 ${ampm}`;
      }
    );

    console.log("Generated Time Slots:", {
      slots,
      dayOfWeek,
      dayIndex,
    });
    return slots;
  };

  useEffect(() => {
    async function checkAvailability() {
      if (!selectedDate) return;

      setIsCheckingAvailability(true);
      const dateKey = selectedDate.toISOString().split("T")[0];
      
      // Use cached result if available
      if (availableSlotsCache[dateKey]) {
        setAvailableTimeSlots(availableSlotsCache[dateKey]);
        setIsCheckingAvailability(false);
        return;
      }

      const potentialSlots = getAvailableTimeSlots(selectedDate);
      console.log("Checking Availability for Date:", {
        selectedDate,
        potentialSlots,
      });

      // Run all slot checks concurrently
      const results = await Promise.all(
        potentialSlots.map(async (time) => {
          const [timeStr, period] = time.split(" ");
          const [hours] = timeStr.split(":");
          let hour24 = parseInt(hours);
          if (period === "PM" && hour24 !== 12) {
            hour24 += 12;
          } else if (period === "AM" && hour24 === 12) {
            hour24 = 0;
          }
          const slotDate = new Date(selectedDate);
          slotDate.setHours(hour24, 0, 0, 0);

          console.log("Checking Time Slot:", {
            time,
            hour24,
            slotDate,
          });

          const availabilityResult = await checkTimeSlotAvailability(
            consultant.id,
            slotDate
          );

          console.log("Availability Result:", {
            time,
            result: availabilityResult,
          });

          return { time, available: availabilityResult.isAvailable };
        })
      );

      const availableSlots = results
        .filter(result => result.available)
        .map(result => result.time);

      console.log("Final Available Slots:", availableSlots);

      // Cache the result for this date
      setAvailableSlotsCache(prev => ({ ...prev, [dateKey]: availableSlots }));
      setAvailableTimeSlots(availableSlots);
      setIsCheckingAvailability(false);
    }

    checkAvailability();
  }, [selectedDate, consultant.id, availability, availableSlotsCache]);

  const handleBooking = async (time: string) => {
    if (!selectedDate) return;

    try {
      setIsLoading(true);

      if (hasActiveBooking) {
        toast.error(t("booking.existingBookingError"));
        return;
      }

      // Parse time in format "9:00 AM"
      const [timeStr, period] = time.split(" ");
      const [hours] = timeStr.split(":");
      let hour24 = parseInt(hours);

      if (period === "PM" && hour24 !== 12) {
        hour24 += 12;
      } else if (period === "AM" && hour24 === 12) {
        hour24 = 0;
      }

      const scheduledTime = new Date(selectedDate);
      scheduledTime.setHours(hour24, 0, 0, 0);

      // Check if the time slot is already booked
      const isTimeSlotBooked = existingBookings.some(
        (booking) => booking.getTime() === scheduledTime.getTime()
      );

      if (isTimeSlotBooked) {
        toast.error(t("booking.timeSlotTaken"));
        return;
      }

      const { booking, error } = await createBooking(
        consultant.id,
        scheduledTime,
        consultant.meet_link || ""
      );

      if (error) {
        throw error;
      }

      toast.success(t("bookingSuccess"));
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error booking consultation:", error);
      toast.error(t("bookingError"));
    } finally {
      setIsLoading(false);
    }
  };

  if (hasActiveBooking) {
    return (
      <Alert>
        <AlertDescription>{t("booking.activeBookingWarning")}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">
          {t("bookSession")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4 sm:mb-6">
          <DialogTitle className="text-lg sm:text-xl text-center">
            {t("booking.title")}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-center">
            {t("booking.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:gap-6" dir="ltr">
          <div className="flex justify-center items-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border mx-auto"
              weekStartsOn={0}
              formatters={{
                formatWeekdayName: (date) =>
                  date.toLocaleDateString("en-US", { weekday: "short" }),
              }}
              classNames={{
                months:
                  "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                table: "w-full border-collapse space-y-1",
                head_row: "flex justify-center",
                head_cell:
                  "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex justify-center mt-2",
                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                day_selected:
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle:
                  "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const dayIndex = date.getDay();
                const dayOfWeek = DAYS[dayIndex] as DayOfWeek;
                const dayAvailability = availability.find(
                  (a) => a.day === dayOfWeek
                );

                const isDisabled = date < today || !dayAvailability?.isEnabled;
                console.log("Calendar Day Check:", {
                  date,
                  dayIndex,
                  dayOfWeek,
                  isEnabled: dayAvailability?.isEnabled,
                  isDisabled,
                });
                return isDisabled;
              }}
            />
          </div>
          {selectedDate && (
            <div className="space-y-4">
              {isCheckingAvailability ? (
                <div className="flex justify-center items-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    {t("booking.checkingAvailability", {
                      fallback: "Checking availability...",
                    })}
                  </span>
                </div>
              ) : availableTimeSlots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableTimeSlots.map((time) => (
                    <Button
                      key={time}
                      variant="outline"
                      onClick={() => handleBooking(time)}
                      disabled={isLoading}
                      className="px-2 py-1.5 h-auto text-sm sm:text-base sm:px-3 sm:py-2"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">
                    {t("booking.noAvailableSlots", {
                      fallback: "No available time slots for this date",
                    })}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
