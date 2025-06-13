
// --- File: DPPTableRow.tsx ---
// Description: Component to render a single row in the DPPTable for the Live Dashboard.
"use client";

import React from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MoreHorizontal, Eye, Edit as EditIconLucide, Settings as SettingsIcon, Bot, Trash2, ExternalLink, Package } from "lucide-react";
import type { ProcessedDPP } from '@/hooks/useDPPLiveData'; // Import ProcessedDPP
import { getOverallComplianceDetails, getEbsiStatusDetails } from "@/utils/dppDisplayUtils";
import ProductCompletenessIndicator from '@/components/products/list/ProductCompletenessIndicator'; // Import completeness indicator
import { cn } from "@/lib/utils";

interface DPPTableRowProps {
  dpp: ProcessedDPP; // Use ProcessedDPP which includes completeness and overallCompliance
  onDeleteProduct?: (productId: string) => void;
  onViewAiSummary: (productId: string) => void;
}

export function DPPTableRow({ dpp, onDeleteProduct, onViewAiSummary }: DPPTableRowProps) {
  const router = useRouter();
  // overallCompliance and completeness are now part of the dpp prop (ProcessedDPP)
  const complianceDetails = dpp.overallCompliance; 
  const ebsiStatusDetails = getEbsiStatusDetails(dpp.ebsiVerification?.status);

  const handleDPPSettings = (dppId: string) => {
    alert(`Mock: Opening settings for DPP ${dppId}.`);
  };

  return (
    <TableRow key={dpp.id} className="hover:bg-muted/50 transition-colors">
      <TableCell className="font-medium">
        <Link href={`/products/${dpp.id}`} className="text-primary hover:underline" title="View Internal Product Details">
          {dpp.id}
        </Link>
      </TableCell>
      <TableCell>{dpp.productName}</TableCell>
      <TableCell>{dpp.manufacturer?.name || "N/A"}</TableCell> {/* Display Manufacturer */}
      <TableCell>{dpp.category}</TableCell>
      <TableCell>
        <Badge
          variant={
            dpp.metadata.status === "published" ? "default" :
            dpp.metadata.status === "archived" ? "secondary" : "outline"
          }
          className={cn(
            "capitalize",
            dpp.metadata.status === "published" && "bg-green-100 text-green-700 border-green-300",
            dpp.metadata.status === "draft" && "bg-yellow-100 text-yellow-700 border-yellow-300",
            dpp.metadata.status === "pending_review" && "bg-orange-100 text-orange-600 border-orange-300",
            dpp.metadata.status === "archived" && "bg-muted text-muted-foreground"
          )}
        >
          {dpp.metadata.status.replace('_', ' ')}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild><span className="cursor-help">{complianceDetails.icon}</span></TooltipTrigger>
              <TooltipContent><p>{complianceDetails.tooltipText}</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Badge
            variant={complianceDetails.variant}
             className={cn(
                "capitalize", // Added capitalize for consistency
                complianceDetails.variant === "default" && "bg-green-100 text-green-700 border-green-300",
                complianceDetails.variant === "destructive" && "bg-red-100 text-red-700 border-red-300",
                complianceDetails.variant === "outline" && complianceDetails.text === "Pending" && "bg-yellow-100 text-yellow-700 border-yellow-300",
                complianceDetails.variant === "outline" && complianceDetails.text === "No Data" && "bg-blue-100 text-blue-700 border-blue-300",
                complianceDetails.variant === "outline" && complianceDetails.text === "Review Needed" && "bg-orange-100 text-orange-700 border-orange-300", // Added for Review Needed
                complianceDetails.variant === "secondary" && "bg-muted text-muted-foreground"
            )}
          >
            {complianceDetails.text}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild><span className="cursor-help">{ebsiStatusDetails.icon}</span></TooltipTrigger>
              <TooltipContent><p>{ebsiStatusDetails.tooltipText}</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Badge
            variant={ebsiStatusDetails.variant}
            className={cn(
                "capitalize",
                ebsiStatusDetails.variant === "default" && "bg-green-100 text-green-700 border-green-300",
                ebsiStatusDetails.variant === "destructive" && "bg-red-100 text-red-700 border-red-300",
                ebsiStatusDetails.variant === "outline" && "bg-yellow-100 text-yellow-700 border-yellow-300",
                ebsiStatusDetails.variant === "secondary" && "bg-muted text-muted-foreground"
            )}
          >
            {ebsiStatusDetails.text.replace('_', ' ')}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <ProductCompletenessIndicator completenessData={dpp.completeness} /> {/* Display Completeness */}
      </TableCell>
      <TableCell>{new Date(dpp.metadata.last_updated).toLocaleDateString()}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
              <span className="sr-only">DPP Actions for {dpp.productName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/passport/${dpp.id}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> View Public Passport
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewAiSummary(dpp.id)}>
              <Bot className="mr-2 h-4 w-4" /> View AI Summary
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/products/${dpp.id}`)}> {/* Internal View */}
              <Package className="mr-2 h-4 w-4" /> View Internal Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/products/new?edit=${dpp.id}`)}>
              <EditIconLucide className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDPPSettings(dpp.id)}>
              <SettingsIcon className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
             {onDeleteProduct && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDeleteProduct(dpp.id)} className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
