
// --- File: src/app/api/v1/dpp/route.ts ---
// Description: Conceptual API endpoint to create a new Digital Product Passport and list DPPs with filters.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateApiKey } from '@/middleware/apiKeyAuth';
import { MOCK_DPPS } from '@/data';
import type { DigitalProductPassport, CustomAttribute, DashboardFiltersState, OwnershipNftLink, TextileInformation, ConstructionProductInformation } from '@/types/dpp';

// Interface to reflect the expected request body for creating a DPP
interface CreateDppRequestBody {
  productName: string;
  category: string;
  gtin?: string;
  manufacturerName?: string;
  modelNumber?: string;
  productDetails?: {
    description?: string;
    materials?: Array<{ name: string; percentage?: number; isRecycled?: boolean }>;
    energyLabel?: string;
    customAttributes?: CustomAttribute[];
    imageUrl?: string;
    imageHint?: string;
  };
  textileInformation?: TextileInformation;
  constructionProductInformation?: ConstructionProductInformation;
  authenticationVcId?: string;
  ownershipNftLink?: OwnershipNftLink;
  // Note: onChainStatus and onChainLifecycleStage are set by server default, not part of request body
}

export async function POST(request: NextRequest) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  let requestBody: CreateDppRequestBody;
  try {
    requestBody = await request.json();
  } catch (error) {
    return NextResponse.json({ error: { code: 400, message: "Invalid JSON payload." } }, { status: 400 });
  }

  const {
    productName,
    category,
    gtin,
    manufacturerName,
    modelNumber,
    productDetails,
    textileInformation,
    constructionProductInformation,
    authenticationVcId,
    ownershipNftLink,
  } = requestBody;

  if (!productName || typeof productName !== 'string' || productName.trim() === '') {
    return NextResponse.json({ error: { code: 400, message: "Field 'productName' is required and must be a non-empty string." } }, { status: 400 });
  }
  if (!category || typeof category !== 'string' || category.trim() === '') {
    return NextResponse.json({ error: { code: 400, message: "Field 'category' is required and must be a non-empty string." } }, { status: 400 });
  }

  const newProductId = `DPP_API_${Date.now().toString().slice(-5)}`;
  const now = new Date().toISOString();

  const newDpp: DigitalProductPassport = {
    id: newProductId,
    productName,
    category,
    gtin: gtin || undefined,
    manufacturer: manufacturerName ? { name: manufacturerName } : undefined,
    modelNumber: modelNumber || undefined,
    metadata: {
      created_at: now,
      last_updated: now,
      status: 'draft',
      dppStandardVersion: "CIRPASS v1.0 Draft",
      onChainStatus: "Unknown", // Default value for new products
      onChainLifecycleStage: "Design", // Default value for new products
      isArchived: false, // New products are not archived
    },
    productDetails: {
      description: productDetails?.description || undefined,
      materials: productDetails?.materials || [],
      energyLabel: productDetails?.energyLabel || undefined,
      customAttributes: productDetails?.customAttributes || [],
      imageUrl: productDetails?.imageUrl || `https://placehold.co/600x400.png?text=${encodeURIComponent(productName.substring(0,15))}`,
      imageHint: productDetails?.imageHint || productName.toLowerCase().split(" ").slice(0,2).join(" "),
    },
    textileInformation: textileInformation || undefined,
    constructionProductInformation: constructionProductInformation || undefined,
    authenticationVcId: authenticationVcId || undefined,
    ownershipNftLink: ownershipNftLink || undefined,
    compliance: {
      eprel: { status: 'N/A', lastChecked: now },
      esprConformity: { status: 'pending_assessment', assessmentDate: now },
      battery_regulation: { status: 'not_applicable' },
      scipNotification: { status: 'N/A', lastChecked: now },
      euCustomsData: { status: 'N/A', lastChecked: now },
    },
    ebsiVerification: {
      status: 'pending_verification',
      lastChecked: now,
    },
    lifecycleEvents: [],
    certifications: [],
    supplyChainLinks: [],
    consumerScans: 0,
  };

  MOCK_DPPS.push(newDpp);
  await new Promise(resolve => setTimeout(resolve, 250));
  return NextResponse.json(newDpp, { status: 201 });
}

export async function GET(request: NextRequest) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') as DashboardFiltersState['status'] | null;
  const categoryParam = searchParams.get('category') as DashboardFiltersState['category'] | null;
  const searchQuery = searchParams.get('searchQuery') as DashboardFiltersState['searchQuery'] | null;
  const blockchainAnchored = searchParams.get('blockchainAnchored') as DashboardFiltersState['blockchainAnchored'] | null;
  const isTextileProductParam = searchParams.get('isTextileProduct');
  const isConstructionProductParam = searchParams.get('isConstructionProduct');
  const includeArchivedParam = searchParams.get('includeArchived'); // New parameter

  let filteredDPPs: DigitalProductPassport[] = [...MOCK_DPPS];

  // Filter by isArchived first, unless includeArchived=true
  if (includeArchivedParam !== 'true') {
    filteredDPPs = filteredDPPs.filter(dpp => !dpp.metadata.isArchived);
  }
  
  if (searchQuery) {
    const lowerSearchQuery = searchQuery.toLowerCase();
    filteredDPPs = filteredDPPs.filter(dpp =>
      dpp.productName.toLowerCase().includes(lowerSearchQuery) ||
      dpp.id.toLowerCase().includes(lowerSearchQuery) ||
      (dpp.gtin && dpp.gtin.toLowerCase().includes(lowerSearchQuery)) ||
      (dpp.manufacturer?.name && dpp.manufacturer.name.toLowerCase().includes(lowerSearchQuery))
    );
  }

  if (status && status !== 'all') {
    // If filtering for 'archived' status, we need to consider 'isArchived' flag if includeArchived was true.
    // However, the primary mechanism for "archived" from UI perspective is now isArchived flag.
    // So, if `status === 'archived'`, it's handled by the includeArchived logic above and client-side filtering.
    // For other statuses, we filter by `metadata.status`.
    if (status !== 'archived') {
      filteredDPPs = filteredDPPs.filter(dpp => dpp.metadata.status === status);
    }
    // If status === 'archived', the API has already potentially included them if includeArchived=true.
    // The client (useDPPLiveData) will do the final filter for dpp.metadata.isArchived === true.
  }


  if (categoryParam && categoryParam !== 'all') {
    filteredDPPs = filteredDPPs.filter(dpp => dpp.category === categoryParam);
  }
  
  if (blockchainAnchored) {
    if (blockchainAnchored === 'anchored') {
        filteredDPPs = filteredDPPs.filter(dpp => !!dpp.blockchainIdentifiers?.anchorTransactionHash);
    } else if (blockchainAnchored === 'not_anchored') {
        filteredDPPs = filteredDPPs.filter(dpp => !dpp.blockchainIdentifiers?.anchorTransactionHash);
    }
  }

  const isTextileProduct = isTextileProductParam === 'true' ? true : isTextileProductParam === 'false' ? false : undefined;
  const isConstructionProduct = isConstructionProductParam === 'true' ? true : isConstructionProductParam === 'false' ? false : undefined;

  if (isTextileProduct !== undefined) {
    filteredDPPs = filteredDPPs.filter(dpp => !!dpp.textileInformation === isTextileProduct);
  }
  if (isConstructionProduct !== undefined) {
    filteredDPPs = filteredDPPs.filter(dpp => !!dpp.constructionProductInformation === isConstructionProduct);
  }


  await new Promise(resolve => setTimeout(resolve, 300));

  return NextResponse.json({
    data: filteredDPPs,
    filtersApplied: {
      status,
      category: categoryParam,
      searchQuery,
      blockchainAnchored,
      isTextileProduct, 
      isConstructionProduct, 
      includeArchived: includeArchivedParam === 'true', // Reflect the param
    },
    totalCount: filteredDPPs.length,
  });
}

