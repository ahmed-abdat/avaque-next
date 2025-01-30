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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ConsultantProfile } from "../../types";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BookingFormProps {
  consultant: ConsultantProfile;
  locale: string;
}

interface Booking {
  id: string;
  consultant_id: string;
  scheduled_time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export function BookingForm({ consultant, locale }: BookingFormProps) {
  const t = useTranslations("Consultants");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [hasActiveBooking, setHasActiveBooking] = useState(false);
  const [existingBookings, setExistingBookings] = useState<Date[]>([]);

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

  // Get available time slots (9 AM to 5 PM)
  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 9;
    return `${hour}:00`;
  });

  const handleBooking = async (time: string) => {
    if (!selectedDate) return;

    try {
      setIsLoading(true);

      if (hasActiveBooking) {
        toast.error(t("booking.existingBookingError"));
        return;
      }

      // Combine date and time
      const [hours] = time.split(":");
      const scheduledTime = new Date(selectedDate);
      scheduledTime.setHours(parseInt(hours), 0, 0, 0);

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("booking.title")}</DialogTitle>
          <DialogDescription>{t("booking.description")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            disabled={(date) => {
              // Disable past dates and weekends
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today || date.getDay() === 0 || date.getDay() === 6;
            }}
          />
          {selectedDate && (
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => {
                const [hours] = time.split(":");
                const timeSlotDate = new Date(selectedDate);
                timeSlotDate.setHours(parseInt(hours), 0, 0, 0);

                const isBooked = existingBookings.some(
                  (booking) => booking.getTime() === timeSlotDate.getTime()
                );

                return (
                  <Button
                    key={time}
                    variant={isBooked ? "secondary" : "outline"}
                    onClick={() => !isBooked && handleBooking(time)}
                    disabled={isLoading || isBooked}
                  >
                    {time}
                    {isBooked && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        ({t("booking.booked")})
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
