
"use client";

import type { SimpleProductDetail } from "@/types/dpp";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Package, Tag, Building, CheckCircle, AlertTriangle, Info, ShieldCheck, Barcode, QrCode as QrCodeIcon, Globe2 } from "lucide-react";
import { getStatusIcon as getComplianceStatusIcon, getStatusBadgeVariant as getComplianceBadgeVariant, getStatusBadgeClasses as getComplianceBadgeClasses } from "@/utils/dppDisplayUtils";
import React from "react";
import QrCodeGenerator from "@/components/qr/QrCodeGenerator"; // Re-added this
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProductHeaderProps {
  product: SimpleProductDetail;
}

export default function ProductHeader({ product }: ProductHeaderProps) {
  if (!product) {
    return null;
  }

  const getProductStatusBadgeVariant = (status: SimpleProductDetail['status']) => {
    switch (status) {
      case "Active": return "default";
      case "Pending": return "outline";
      case "Draft": return "secondary";
      case "Archived": return "secondary";
      default: return "secondary";
    }
  };

  const getProductStatusBadgeClass = (status: SimpleProductDetail['status']) => {
    switch (status) {
        case "Active": return "bg-green-100 text-green-700 border-green-300";
        case "Pending": return "bg-yellow-100 text-yellow-700 border-yellow-300";
        case "Draft": return "bg-gray-100 text-gray-700 border-gray-300";
        case "Archived": return "bg-muted text-muted-foreground";
        default: return "bg-muted text-muted-foreground";
    }
  }

  const ProductStatusIcon = product.status === "Active" ? CheckCircle : product.status === "Pending" ? Info : AlertTriangle;

  const overallComplianceStatus = product.complianceSummary?.overallStatus || "N/A";
  const ComplianceStatusIconComponent = getComplianceStatusIcon(overallComplianceStatus);
  const complianceBadgeVariant = getComplianceBadgeVariant(overallComplianceStatus);
  const complianceBadgeClasses = getComplianceBadgeClasses(overallComplianceStatus);
  const formattedOverallComplianceText = overallComplianceStatus
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());

  return (
    <Card className="mb-6 shadow-md">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            {/* Left Side: Product Info & Identifiers */}
            <div className="flex-grow">
                <div className="flex items-center mb-1.5">
                    <Package className="mr-3 h-8 w-8 text-primary flex-shrink-0" />
                    <CardTitle className="text-2xl md:text-3xl font-headline text-primary">
                        {product.productName}
                    </CardTitle>
                </div>
                <CardDescription className="text-sm text-muted-foreground ml-11">
                    Product ID: {product.id}
                    {product.modelNumber && ` | Model: ${product.modelNumber}`}
                </CardDescription>
                
                <div className="mt-3 ml-11 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {product.category && (
                        <div className="flex items-center">
                            <Tag className="h-3.5 w-3.5 mr-1 text-primary/70" />
                            Category: <span className="font-medium text-foreground/80 ml-1">{product.category}</span>
                        </div>
                    )}
                    {product.manufacturer && (
                        <div className="flex items-center">
                            <Building className="h-3.5 w-3.5 mr-1 text-primary/70" />
                            Manufacturer: <span className="font-medium text-foreground/80 ml-1">{product.manufacturer}</span>
                        </div>
                    )}
                    {product.gtin && (
                        <div className="flex items-center">
                            <Barcode className="h-3.5 w-3.5 mr-1 text-primary/70" />
                            GTIN: <span className="font-medium text-foreground/80 ml-1">{product.gtin}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side: Status Badges & Actions */}
            <div className="flex flex-col items-start md:items-end gap-2.5 mt-2 md:mt-0 shrink-0">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Badge
                                variant={getProductStatusBadgeVariant(product.status)}
                                className={cn("text-xs px-2.5 py-1 min-w-[120px] justify-center", getProductStatusBadgeClass(product.status))}
                            >
                                <ProductStatusIcon className="mr-1.5 h-3.5 w-3.5" />
                                {product.status}
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent><p>Current platform status of the product's DPP record.</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                             <Badge
                                variant={complianceBadgeVariant}
                                className={cn("text-xs px-2.5 py-1 min-w-[120px] justify-center", complianceBadgeClasses)}
                            >
                               {React.cloneElement(ComplianceStatusIconComponent, { className: "mr-1.5 h-3.5 w-3.5" })}
                               {formattedOverallComplianceText}
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent><p>Overall compliance status based on available data.</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <div className="flex gap-2 mt-1">
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/dpp-global-tracker-v2?productId=${product.id}`}>
                            <Globe2 className="mr-1.5 h-4 w-4" /> Global Tracker
                        </Link>
                    </Button>
                    {/* QR Code might be better in its own tab or a dedicated section if header is too busy */}
                </div>
            </div>
        </div>
      </CardHeader>
    </Card>
  );
}
