"use client";

import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface TabItem {
  value: string;
  label?: string;
  icon?: ReactNode;
  title?: string;
  content: ReactNode;
  skipCard?: boolean;
}

interface CustomTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  isRtl?: boolean;
  className?: string;
  onChange?: (value: string) => void;
  variant?: "default" | "card";
}

export function CustomTabs({
  tabs,
  defaultValue,
  isRtl = false,
  className,
  onChange,
  variant = "default",
}: CustomTabsProps) {
  const renderTabContent = (tab: TabItem) => {
    if (variant === "card" && !tab.skipCard) {
      return (
        <Card>
          {(tab.title || tab.label) && (
            <CardHeader>
              <CardTitle>{tab.title || tab.label}</CardTitle>
            </CardHeader>
          )}
          <CardContent>{tab.content}</CardContent>
        </Card>
      );
    }

    return (
      <div>
        {!tab.skipCard && (tab.title || tab.label) && (
          <h2 className="text-2xl font-semibold mb-6">
            {tab.title || tab.label}
          </h2>
        )}
        {tab.content}
      </div>
    );
  };

  return (
    <Tabs
      defaultValue={defaultValue || tabs[0].value}
      className={className}
      dir={isRtl ? "rtl" : "ltr"}
      onValueChange={onChange}
    >
      <TabsList className={cn("grid w-full", `grid-cols-${tabs.length}`)}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex items-center gap-2"
          >
            {tab.icon}
            {tab.label && <span>{tab.label}</span>}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {renderTabContent(tab)}
        </TabsContent>
      ))}
    </Tabs>
  );
}
