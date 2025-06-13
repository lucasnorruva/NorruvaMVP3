
// --- File: SustainabilityTab.tsx ---
// Description: Displays sustainability-related information for a product.
"use client";

import type { SimpleProductDetail } from "@/types/dpp";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Zap, Recycle, Wrench, CheckCircle, ExternalLink, Users, PackageCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SustainabilityTabProps {
  product: SimpleProductDetail;
}

const DetailItem: React.FC<{ label: string; value?: string | number | null; unit?: string; link?: string; icon?: React.ElementType }> = ({ label, value, unit, link, icon: Icon }) => {
  if (value === undefined || value === null || String(value).trim() === "") return null;
  return (
    <div className="flex justify-between items-center text-sm py-2 border-b border-border/30 last:border-b-0">
      <span className="text-muted-foreground flex items-center">
        {Icon && <Icon className="h-4 w-4 mr-2 text-muted-foreground/80" />}
        {label}:
      </span>
      <span className="font-medium text-foreground/90 text-right">
        {value}
        {unit && <span className="ml-0.5 text-xs text-muted-foreground">{unit}</span>}
        {link && (
          <Link href={link} target="_blank" rel="noopener noreferrer" className="ml-2 text-primary hover:underline text-xs inline-flex items-center">
            View <ExternalLink className="h-3 w-3 ml-1" />
          </Link>
        )}
      </span>
    </div>
  );
};

export default function SustainabilityTab({ product }: SustainabilityTabProps) {
  if (!product) {
    return <p className="text-muted-foreground p-4">Sustainability data not available.</p>;
  }

  const repairability = product.productDetails?.repairabilityScore;
  const recyclability = product.productDetails?.recyclabilityInformation;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Leaf className="mr-2 h-5 w-5 text-green-600" /> Key Sustainability Claims
          </CardTitle>
        </CardHeader>
        <CardContent>
          {product.keySustainabilityPoints && product.keySustainabilityPoints.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {product.keySustainabilityPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-success flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No specific sustainability claims listed.</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Users className="mr-2 h-5 w-5 text-indigo-600" /> Materials & Circularity
          </CardTitle>
          <CardDescription>Information about materials used and recyclability.</CardDescription>
        </CardHeader>
        <CardContent>
          {product.materialsUsed && product.materialsUsed.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Material Composition:</h4>
              <ul className="space-y-2 text-sm">
                {product.materialsUsed.map((material, index) => (
                  <li key={index} className="p-2 bg-muted/50 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{material.name}</span>
                      {material.percentage !== undefined && material.percentage !== null && <Badge variant="secondary">{material.percentage}%</Badge>}
                    </div>
                    {material.source && <p className="text-xs text-muted-foreground">Source: {material.source}</p>}
                    {material.isRecycled && <Badge variant="outline" className="mt-1 text-xs border-green-500/50 text-green-600 bg-green-500/10">Recycled Content {material.recycledContentPercentage !== undefined ? `(${material.recycledContentPercentage}%)` : ''}</Badge>}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Material composition details not available.</p>
          )}
          {recyclability && (
            <div className="pt-3 mt-3 border-t border-border/50">
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Recyclability:</h4>
               <DetailItem label="Recyclable Content" value={recyclability.percentage} unit="%" icon={Recycle}/>
               {recyclability.instructionsUrl && (
                 <Link href={recyclability.instructionsUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block">
                   <Button variant="outline" size="sm" className="text-xs">
                     <PackageCheck className="mr-1.5 h-3.5 w-3.5"/> Recycling Instructions
                   </Button>
                 </Link>
               )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Zap className="mr-2 h-5 w-5 text-warning" /> Energy Efficiency
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DetailItem label="Energy Label Rating" value={product.energyLabelRating} />
          {/* Add more energy related fields if available from product data */}
          {!product.energyLabelRating && <p className="text-sm text-muted-foreground">Energy label information not specified.</p>}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Wrench className="mr-2 h-5 w-5 text-blue-600" /> Repairability & End-of-Life
          </CardTitle>
          <CardDescription>Information on product maintenance, repair, and disposal.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {repairability && (repairability.value !== null && repairability.value !== undefined) && (
            <div>
              <h4 className="text-sm font-medium mb-1">Repairability Score:</h4>
              <p className="text-foreground/90">
                <span className="font-bold text-xl text-blue-700">{repairability.value}</span> / {repairability.scale || 10}
                {repairability.reportUrl && (
                  <Link href={repairability.reportUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="link" size="sm" className="p-0 h-auto ml-2 text-xs inline-flex items-center">View Report <ExternalLink className="h-3 w-3 ml-1"/></Button>
                  </Link>
                )}
              </p>
              {repairability.vcId && <p className="text-xs text-muted-foreground mt-0.5">VC ID: <span className="font-mono">{repairability.vcId}</span></p>}
            </div>
          )}
          <DetailItem label="Spare Parts Availability" value={product.productDetails?.sparePartsAvailability} />
          <DetailItem label="Repair Manual" value={product.productDetails?.repairManualUrl ? "View/Download" : undefined} link={product.productDetails?.repairManualUrl} />
          <DetailItem label="Disassembly Instructions" value={product.productDetails?.disassemblyInstructionsUrl ? "View/Download" : undefined} link={product.productDetails?.disassemblyInstructionsUrl} />
          
          {(!repairability || repairability.value === null) && !product.productDetails?.sparePartsAvailability && !product.productDetails?.repairManualUrl && !product.productDetails?.disassemblyInstructionsUrl && (
             <p className="text-sm text-muted-foreground">Repair and detailed end-of-life information not specified for this product.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    