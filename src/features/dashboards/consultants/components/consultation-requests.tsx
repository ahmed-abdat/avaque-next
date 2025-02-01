"use client";

import { useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconCalendar } from "@tabler/icons-react";
import { ConsultationRequest } from "../type";

interface ConsultationRequestsProps {
  requests: ConsultationRequest[];
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  isRTL: boolean;
}

export function ConsultationRequests({
  requests,
  onUpdateStatus,
  isRTL,
}: ConsultationRequestsProps) {
  const t = useTranslations("ConsultantDashboard");
  const [selectedRequest, setSelectedRequest] =
    useState<ConsultationRequest | null>(null);

  const formatDate = useCallback(
    (date: Date) =>
      date.toLocaleDateString(isRTL ? "ar" : "fr", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [isRTL]
  );

  const desktopRows = useMemo(
    () =>
      requests.map((request) => (
        <TableRow key={request.id}>
          <TableCell>
            <div className="font-medium">{request.studentName}</div>
            <div className="text-sm text-muted-foreground">
              {request.studentEmail}
            </div>
          </TableCell>
          <TableCell>{formatDate(new Date(request.requestDate))}</TableCell>
          <TableCell>
            <Badge variant={getStatusVariant(request.status)}>
              {t(`requests.status.${request.status}`)}
            </Badge>
          </TableCell>
          <TableCell>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedRequest(request)}
            >
              {t("requests.viewDetails")}
            </Button>
          </TableCell>
        </TableRow>
      )),
    [requests, formatDate, t]
  );

  const mobileCards = useMemo(
    () =>
      requests.map((request) => (
        <MobileRequestCard
          key={request.id}
          request={request}
          formatDate={formatDate}
          isRTL={isRTL}
        />
      )),
    [requests, formatDate, isRTL]
  );

  const handleStatusUpdate = async (status: string) => {
    if (!selectedRequest) return;
    try {
      await onUpdateStatus(selectedRequest.id, status);
      toast.success(t("requests.statusUpdated"), {
        className: isRTL ? "rtl" : "ltr",
      });
      setSelectedRequest(null);
    } catch (error) {
      toast.error(t("requests.updateError"), {
        className: isRTL ? "rtl" : "ltr",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Mobile View */}
      <div className="grid gap-4 md:hidden">{mobileCards}</div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("requests.table.student")}</TableHead>
                <TableHead>{t("requests.table.subject")}</TableHead>
                <TableHead>{t("requests.table.date")}</TableHead>
                <TableHead>{t("requests.table.status")}</TableHead>
                <TableHead>{t("requests.table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{desktopRows}</TableBody>
          </Table>
        </Card>
      </div>

      {/* Request Details Dialog */}
      <Dialog
        open={!!selectedRequest}
        onOpenChange={() => setSelectedRequest(null)}
      >
        <DialogContent className={isRTL ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle>{t("requests.detailsTitle")}</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <div className="font-medium">{selectedRequest.studentName}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedRequest.studentEmail}
                </div>
              </div>
              <div className="grid gap-1">
                <div className="font-medium">{t("requests.date")}</div>
                <div>{formatDate(new Date(selectedRequest.requestDate))}</div>
              </div>
              <div className="grid gap-1">
                <div className="font-medium">{t("requests.status")}</div>
                <Badge variant={getStatusVariant(selectedRequest.status)}>
                  {t(`requests.status.${selectedRequest.status}`)}
                </Badge>
              </div>
              {selectedRequest.status === "pending" && (
                <div className={`flex gap-2`}>
                  <Button onClick={() => handleStatusUpdate("approved")}>
                    {t("requests.approve")}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleStatusUpdate("rejected")}
                  >
                    {t("requests.reject")}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getStatusVariant(
  status: string
): "default" | "destructive" | "outline" | "secondary" {
  switch (status) {
    case "approved":
      return "secondary";
    case "rejected":
      return "destructive";
    default:
      return "default";
  }
}

function MobileRequestCard({
  request,
  formatDate,
  isRTL,
}: {
  request: ConsultationRequest;
  formatDate: (date: Date) => string;
  isRTL: boolean;
}) {
  const t = useTranslations("ConsultantDashboard");
  return (
    <Card className="cursor-pointer hover:bg-muted/50">
      <CardContent className={`p-4`}>
        <div className="space-y-2">
          <div className={`flex items-center justify-between`}>
            <p className="font-medium">{request.studentName}</p>
            <Badge variant={getStatusVariant(request.status)}>
              {t(`requests.status.${request.status}`)}
            </Badge>
          </div>
          <div
            className={`flex items-center gap-2 text-sm text-muted-foreground`}
          >
            <IconCalendar className="h-4 w-4" />
            <span>{formatDate(new Date(request.requestDate))}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
