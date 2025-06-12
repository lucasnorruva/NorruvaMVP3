
// --- File: SustainabilityTab.tsx ---
// Description: Displays sustainability-related information for a product.
"use client";

import type { SimpleProductDetail } from "@/types/dpp";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Zap, Recycle, Wrench, CheckCircle, AlertCircle, Info, Users, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SustainabilityTabProps {
  product: SimpleProductDetail;
}

const DetailItem: React.FC<{ label: string; value?: string | number | null; unit?: string; link?: string }> = ({ label, value, unit, link }) => {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex justify-between items-center text-sm py-1.5 border-b border-border/50 last:border-b-0">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium text-foreground/90">
        {value}
        {unit && <span className="ml-0.5 text-xs text-muted-foreground">{unit}</span>}
        {link && (
          <Link href={link} target="_blank" rel="noopener noreferrer" className="ml-1.5 text-primary hover:underline text-xs inline-flex items-center">
            Details <ExternalLink className="h-3 w-3 ml-1" />
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
            <Users className="mr-2 h-5 w-5 text-indigo-600" /> Materials Composition
          </CardTitle>
        </CardHeader>
        <CardContent>
          {product.materialsUsed && product.materialsUsed.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {product.materialsUsed.map((material, index) => (
                <li key={index} className="p-2 bg-muted/50 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{material.name}</span>
                    {material.percentage && <Badge variant="secondary">{material.percentage}%</Badge>}
                  </div>
                  {material.source && <p className="text-xs text-muted-foreground">Source: {material.source}</p>}
                  {material.isRecycled && <Badge variant="outline" className="mt-1 text-xs border-green-500/50 text-green-600 bg-green-500/10">Recycled Content</Badge>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Material composition details not available.</p>
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
          {product.repairability && (
            <div>
              <h4 className="text-sm font-medium mb-1">Repairability Score:</h4>
              <p className="text-foreground/90">
                <span className="font-bold text-xl text-blue-700">{product.repairability.score}</span> / {product.repairability.scale}
                {product.repairability.detailsUrl && (
                  <Link href={product.repairability.detailsUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="link" size="sm" className="p-0 h-auto ml-2 text-xs inline-flex items-center">View Report <ExternalLink className="h-3 w-3 ml-1"/></Button>
                  </Link>
                )}
              </p>
            </div>
          )}
          <DetailItem label="Spare Parts Availability" value={product.sparePartsAvailability} />
          <DetailItem label="Repair Manual" value="View/Download" link={product.repairManualUrl} />
          <DetailItem label="Disassembly Instructions" value="View/Download" link={product.disassemblyInstructionsUrl} />

          {product.recyclabilityInfo && (
            <div className="pt-2 mt-2 border-t border-border/50">
              <h4 className="text-sm font-medium mb-1">Recyclability:</h4>
               <DetailItem label="Recyclable Content" value={product.recyclabilityInfo.percentage} unit="%" />
               {product.recyclabilityInfo.instructionsUrl && (
                 <Link href={product.recyclabilityInfo.instructionsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block">
                   <Button variant="outline" size="sm" className="text-xs">
                     <Recycle className="mr-1.5 h-3.5 w-3.5"/> Recycling Instructions
                   </Button>
                 </Link>
               )}
            </div>
          )}
          {!product.repairability && !product.sparePartsAvailability && !product.repairManualUrl && !product.disassemblyInstructionsUrl && !product.recyclabilityInfo && (
             <p className="text-sm text-muted-foreground">Repair and end-of-life information not specified.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
