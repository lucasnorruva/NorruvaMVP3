
// --- File: HistoryTab.tsx ---
// Description: Displays product-specific history/audit trail.
"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle, History as HistoryIconLucide, User, Edit, CalendarDays, Info as InfoIcon, FileText, ShieldCheck, CheckCircle, Layers, PlusCircle, Anchor, FileCog, UploadCloud } from 'lucide-react';
import type { HistoryEntry } from '@/types/dpp';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface HistoryTabProps {
  productId: string;
}

const getActionIcon = (actionType: string): React.ElementType => {
  if (actionType.toLowerCase().includes("created")) return PlusCircle;
  if (actionType.toLowerCase().includes("lifecycle")) return Layers;
  if (actionType.toLowerCase().includes("certif")) return Award;
  if (actionType.toLowerCase().includes("ebsi")) return ShieldCheck;
  if (actionType.toLowerCase().includes("status")) return Edit;
  if (actionType.toLowerCase().includes("anchor")) return Anchor;
  if (actionType.toLowerCase().includes("ownership")) return User;
  if (actionType.toLowerCase().includes("document")) return FileText;
  if (actionType.toLowerCase().includes("vc hash")) return FileCog;
  if (actionType.toLowerCase().includes("critical")) return AlertTriangle;
  return Edit; // Default icon
};

export default function HistoryTab({ productId }: HistoryTabProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/v1/dpp/history/${productId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || `Failed to fetch history: ${response.status}`);
        }
        const data: HistoryEntry[] = await response.json();
        setHistory(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(message);
        console.error("Error fetching product history:", err);
      } finally {
        setIsLoading(false);
      }
    }
    if (productId) {
      fetchHistory();
    }
  }, [productId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading product history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading History</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <HistoryIconLucide className="mr-2 h-5 w-5 text-primary" /> Product History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No historical events recorded for this product.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <HistoryIconLucide className="mr-2 h-5 w-5 text-primary" /> Product DPP History & Audit Trail
        </CardTitle>
        <CardDescription>Conceptual audit trail of changes and significant events for this product passport.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-3"> 
          <div className="relative pl-5 space-y-6">
            {/* Vertical timeline bar */}
            <div className="absolute left-[calc(0.625rem-1px)] top-2 bottom-2 w-0.5 bg-border rounded-full -translate-x-1/2"></div>

            {history.map((entry, index) => {
              const ActionIcon = getActionIcon(entry.actionType);
              return (
                <div key={`${entry.timestamp}-${index}`} className="relative flex items-start">
                  <div className="absolute left-0 top-1 flex items-center justify-center w-5 h-5 bg-card border-2 border-primary rounded-full -translate-x-1/2 z-10">
                    <ActionIcon className="h-2.5 w-2.5 text-primary" />
                  </div>
                  <div className="ml-6 w-full p-3 border rounded-md bg-background hover:shadow-sm transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1">
                      <h4 className="font-medium text-sm text-foreground flex items-center">
                        {entry.actionType}
                      </h4>
                      <Badge variant="outline" className="mt-1 sm:mt-0 text-xs px-1.5 py-0.5">
                        Version: {entry.version || 'N/A'}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mb-1.5 flex flex-wrap gap-x-3 gap-y-0.5">
                      <span className="flex items-center">
                        <CalendarDays className="h-3 w-3 mr-1 text-muted-foreground/80"/>
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1 text-muted-foreground/80"/>
                        By: {entry.changedBy}
                      </span>
                    </div>
                    {entry.details && (
                        <p className="text-xs text-foreground/90 p-1.5 bg-muted/30 rounded-sm whitespace-pre-line">
                            <InfoIcon className="inline h-3.5 w-3.5 mr-1 text-info align-text-bottom"/>
                            {entry.details}
                        </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

