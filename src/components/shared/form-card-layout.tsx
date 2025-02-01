// src/components/shared/form-card-layout.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface FormCardLayoutProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  isRTL?: boolean;
}

export function FormCardLayout({
  title,
  children,
  className,
  isRTL = false,
}: FormCardLayoutProps) {
  return (
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      {title && (
        <CardHeader className={isRTL ? "text-right" : "text-left"}>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </CardContent>
    </Card>
  );
}