"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IconVideo, IconVideoPlus, IconLink } from "@tabler/icons-react";

import {
  meetingLinkSchema,
  type MeetingLinkFormValues,
} from "@/lib/validations/consultant";
import { updateMeetingLink } from "@/app/[locale]/actions/consultant";

interface MeetingLinkDialogProps {
  currentLink?: string;
  onSuccess?: () => void;
  isRTL: boolean;
}

export function MeetingLinkDialog({
  currentLink,
  onSuccess,
  isRTL,
}: MeetingLinkDialogProps) {
  const t = useTranslations("ConsultantDashboard");
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MeetingLinkFormValues>({
    resolver: zodResolver(meetingLinkSchema),
    defaultValues: {
      meetLink: currentLink || "",
    },
  });

  async function onSubmit(data: MeetingLinkFormValues) {
    if (data.meetLink === currentLink) {
      toast.info(t("requests.meeting.sameLink"));
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await updateMeetingLink(data);

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success(t("requests.meeting.updated"));
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error updating meeting link:", error);
      toast.error(t("requests.meeting.error"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {currentLink ? (
          <Button variant="outline" className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-transparent to-violet-500/10 transition-transform group-hover:translate-x-full" />
            <IconVideo className="mr-2 h-4 w-4 text-violet-500" />
            <span className="truncate max-w-[200px]">{currentLink}</span>
          </Button>
        ) : (
          <Button variant="outline" className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-transparent to-violet-500/10 transition-transform group-hover:translate-x-full" />
            <IconVideoPlus className="mr-2 h-4 w-4 text-violet-500" />
            {t("requests.meeting.setup")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconVideo className="h-5 w-5 text-violet-500" />
            {t("requests.meeting.setup")}
          </DialogTitle>
          <DialogDescription
            className={`${isRTL ? "text-right" : "text-left"}`}
          >
            {t("requests.meeting.description")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="meetLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("requests.meeting.link")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <IconLink className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="https://meet.google.com/xxx-xxxx-xxx"
                        className="pl-9"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? t("requests.meeting.saving")
                : t("requests.meeting.save")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
