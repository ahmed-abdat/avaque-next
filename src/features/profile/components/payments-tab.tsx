"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";
import { CreditCard, Receipt, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UserType } from "@/types/userType";
import { cn } from "@/lib/utils";

interface PaymentsTabProps {
  user: UserType;
  locale: string;
}

export function PaymentsTab({ user, locale }: PaymentsTabProps) {
  const t = useTranslations("Profile.payments");
  const isRtl = locale === "ar";

  // Placeholder data - replace with real data fetching
  const transactions = [
    {
      id: "TX123",
      date: "2024-03-20",
      amount: 150,
      status: "completed",
      description: "Consultation with Dr. John Doe",
    },
    {
      id: "TX124",
      date: "2024-03-18",
      amount: 100,
      status: "completed",
      description: "Consultation with Dr. Jane Smith",
    },
    // Add more transactions as needed
  ];

  return (
    <div className="space-y-6" dir={isRtl ? "rtl" : "ltr"}>
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="opacity-100">
          <Card className="p-6">
            <div
              className={cn(
                "flex items-center gap-4",
                isRtl && "flex-row-reverse"
              )}
            >
              <div className="rounded-full bg-primary/10 p-3">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div className={isRtl ? "text-right" : "text-left"}>
                <p className="text-sm text-muted-foreground">
                  {t("totalSpent")}
                </p>
                <p className="text-2xl font-bold">$450</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="opacity-100">
          <Card className="p-6">
            <div
              className={cn(
                "flex items-center gap-4",
                isRtl && "flex-row-reverse"
              )}
            >
              <div className="rounded-full bg-green-500/10 p-3">
                <Receipt className="h-6 w-6 text-green-500" />
              </div>
              <div className={isRtl ? "text-right" : "text-left"}>
                <p className="text-sm text-muted-foreground">
                  {t("completedTransactions")}
                </p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="opacity-100">
        <Card>
          <div
            className={cn(
              "flex items-center justify-between border-b border-border p-4",
              isRtl && "flex-row-reverse"
            )}
          >
            <h3 className="font-semibold">{t("transactionHistory")}</h3>
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-8", isRtl && "space-x-reverse")}
            >
              <ArrowUpDown className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} />
              {t("sort")}
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={isRtl ? "text-right" : ""}>
                  {t("transactionId")}
                </TableHead>
                <TableHead className={isRtl ? "text-right" : ""}>
                  {t("date")}
                </TableHead>
                <TableHead className={isRtl ? "text-right" : ""}>
                  {t("description")}
                </TableHead>
                <TableHead className={isRtl ? "text-left" : "text-right"}>
                  {t("amount")}
                </TableHead>
                <TableHead className={isRtl ? "text-right" : ""}>
                  {t("status")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell
                    className={cn("font-mono text-sm", isRtl && "text-right")}
                  >
                    {transaction.id}
                  </TableCell>
                  <TableCell className={isRtl ? "text-right" : ""}>
                    {transaction.date}
                  </TableCell>
                  <TableCell className={isRtl ? "text-right" : ""}>
                    {transaction.description}
                  </TableCell>
                  <TableCell className={isRtl ? "text-left" : "text-right"}>
                    ${transaction.amount}
                  </TableCell>
                  <TableCell className={isRtl ? "text-right" : ""}>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        transaction.status === "completed"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {t(transaction.status)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Empty State */}
      {transactions.length === 0 && (
        <Card className="flex flex-col items-center justify-center p-8 text-center">
          <Receipt className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 font-semibold">{t("noTransactions")}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("noTransactionsDesc")}
          </p>
        </Card>
      )}
    </div>
  );
}
