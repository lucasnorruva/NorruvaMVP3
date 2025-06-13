
"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SimpleProductDetail as Product } from "@/types/dpp"; // CORRECTED TYPE IMPORT
import { Separator } from "@/components/ui/separator";
import { 
  Truck, 
  Calendar, 
  MapPin, 
  Factory, 
  Leaf, 
  Shield, 
  ExternalLink,
  Package,
  Globe,
  Hash,
  Link as LinkIconPath, // Renamed to avoid conflict with NextLink
  CheckCircle,
  Clock,
  AlertCircle,
  Database, // Added Database from existing imports
  Fingerprint, // Added Fingerprint from existing imports
  Layers3, // Added Layers3 from existing imports
  FileCog, // Added FileCog from existing imports
  Tag, // Added Tag from existing imports
  Sigma, // Added Sigma from existing imports
  Layers as LayersIconShadcn // Added Layers from existing imports
} from "lucide-react";
import { getAiHintForImage } from "@/utils/imageUtils";
import NextLink from "next/link"; 
// FIXED: Import the correct functions that actually exist
import { getEbsiStatusDetails, getStatusBadgeClasses } from "@/utils/dppDisplayUtils";
import { cn } from '@/lib/utils'; // Added cn import

interface OverviewTabProps {
  product: Product;
}

export default function OverviewTab({ product }: OverviewTabProps) {
  const getProductStatusIcon = (status?: string) => { // Made status optional for safety
    switch (status?.toLowerCase()) {
      case 'active':
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'discontinued':
      case 'unavailable':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getLifecycleStageIcon = (stage?: string) => { // Made stage optional
    switch (stage?.toLowerCase()) {
      case 'production':
        return <Factory className="h-4 w-4 text-blue-600" />;
      case 'use':
        return <Package className="h-4 w-4 text-green-600" />;
      case 'end-of-life':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  // This part of your code seems to be for a different "Product" type with many more fields
  // than "SimpleProductDetail". I'll adapt what's possible from SimpleProductDetail.
  // The user-provided code references product.images, product.brand, product.manufacturingDate etc.
  // which are not in SimpleProductDetail. I will try to map what exists.
  // If product.complianceSummary.ebsi.status exists, then the UI for EBSI will render.

  const imageDisplayUrl = product.imageUrl || "https://placehold.co/400x300.png?text=No+Image";
  const aiHint = getAiHintForImage({
    productName: product.productName,
    category: product.category,
    imageHint: product.imageHint,
  });

  return (
    <div className="space-y-6">
      {/* Product Images - This section assumes product.images which is not in SimpleProductDetail */}
      {/* For now, using the single imageUrl from SimpleProductDetail */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden border">
            <Image
              src={imageDisplayUrl}
              alt={product.productName || 'Product Image'}
              fill
              className="object-cover"
              data-ai-hint={aiHint}
            />
          </div>
        </CardContent>
      </Card>

      {/* Basic Product Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b py-2 text-sm">
                  <div className="font-medium">Product Status</div>
                  <div className="flex items-center gap-2">
                    {getProductStatusIcon(product.status)}
                    <span className="capitalize">{product.status}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between border-b py-2 text-sm">
                  <div className="font-medium">Category</div>
                  <div>{product.category}</div>
                </div>
                
                {product.manufacturer && (
                  <div className="flex items-center justify-between border-b py-2 text-sm">
                    <div className="font-medium">Brand/Manufacturer</div>
                    <div>{product.manufacturer}</div>
                  </div>
                )}
                
                {product.modelNumber && (
                  <div className="flex items-center justify-between border-b py-2 text-sm">
                    <div className="font-medium">Model</div>
                    <div>{product.modelNumber}</div>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                {/* Manufacturing Date & Location are not in SimpleProductDetail, will skip */}
              </div>
            </div>

            {product.description && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Blockchain & Token Details */}
      {(product.blockchainPlatform || 
        product.contractAddress || 
        product.tokenId || 
        product.anchorTransactionHash || 
        product.onChainStatus || 
        product.onChainLifecycleStage ||
        product.ebsiStatus) && ( // Changed from product.complianceSummary?.ebsi?.status
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIconPath className="h-5 w-5" />
              Blockchain & Token Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                {product.blockchainPlatform && (
                  <div className="flex items-center justify-between border-b py-2 text-sm">
                    <div className="font-medium flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Platform
                    </div>
                    <div>{product.blockchainPlatform}</div>
                  </div>
                )}
                
                {product.contractAddress && (
                  <div className="flex items-center justify-between border-b py-2 text-sm">
                    <div className="font-medium">Contract Address</div>
                    <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {product.contractAddress.slice(0, 10)}...{product.contractAddress.slice(-8)}
                    </div>
                  </div>
                )}
                
                {product.tokenId && (
                  <div className="flex items-center justify-between border-b py-2 text-sm">
                    <div className="font-medium flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Token ID
                    </div>
                    <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {product.tokenId}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                {product.anchorTransactionHash && (
                  <div className="flex items-center justify-between border-b py-2 text-sm">
                    <div className="font-medium">Anchor Transaction Hash</div>
                    <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {product.anchorTransactionHash.slice(0, 10)}...{product.anchorTransactionHash.slice(-8)}
                    </div>
                  </div>
                )}
                
                {product.onChainStatus && (
                  <div className="flex items-center justify-between border-b py-2 text-sm">
                    <div className="font-medium">On-Chain Status</div>
                    <Badge variant="outline">{product.onChainStatus}</Badge>
                  </div>
                )}
                
                {product.onChainLifecycleStage && (
                  <div className="flex items-center justify-between border-b py-2 text-sm">
                    <div className="font-medium">On-Chain Lifecycle Stage</div>
                    <div className="flex items-center gap-2">
                      {getLifecycleStageIcon(product.onChainLifecycleStage)}
                      <span className="capitalize">{product.onChainLifecycleStage}</span>
                    </div>
                  </div>
                )}

                {product.ebsiStatus && (
                  <div className="flex items-center justify-between border-b py-2 text-sm">
                    <div className="font-medium">EBSI Verification</div>
                    {(() => {
                      const ebsiStatusDetails = getEbsiStatusDetails(product.ebsiStatus);
                      const badgeClasses = getStatusBadgeClasses(product.ebsiStatus);
                      return (
                        <Badge variant={ebsiStatusDetails.variant} className={cn(badgeClasses, "capitalize")}>
                          {React.cloneElement(ebsiStatusDetails.icon, {className: "mr-1.5 h-3.5 w-3.5"})}
                          {ebsiStatusDetails.text}
                        </Badge>
                      );
                    })()}
                  </div>
                )}

                {product.ebsiVerificationId && (
                  <div className="flex items-center justify-between border-b py-2 text-sm">
                    <div className="font-medium">EBSI Verification ID</div>
                    <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {product.ebsiVerificationId.slice(0, 10)}...{product.ebsiVerificationId.slice(-8)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Supply Chain Overview - SimpleProductDetail doesn't have product.supplyChain */}
      {/* Sustainability Highlights - SimpleProductDetail doesn't have product.sustainability */}
      {/* Compliance Summary - SimpleProductDetail has complianceSummary, but the provided code structure for it differs. */}
      {/* External Links - SimpleProductDetail doesn't have product.externalUrl or product.qrCode */}

    </div>
  );
}

    