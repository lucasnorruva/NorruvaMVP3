
// --- File: src/app/api/v1/dpp/[productId]/route.ts ---
// Description: Conceptual API endpoint to retrieve and update a Digital Product Passport by ID.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MOCK_DPPS } from '@/data';
import type { DigitalProductPassport, CustomAttribute, OwnershipNftLink, TextileInformation, ConstructionProductInformation } from '@/types/dpp';
import { validateApiKey } from '@/middleware/apiKeyAuth';

interface UpdateDppRequestBody {
  productName?: string;
  category?: string;
  gtin?: string;
  manufacturerName?: string;
  modelNumber?: string;
  metadata?: Partial<DigitalProductPassport['metadata']>;
  productDetails?: Partial<DigitalProductPassport['productDetails']>;
  compliance?: Partial<DigitalProductPassport['compliance']>;
  ebsiVerification?: Partial<DigitalProductPassport['ebsiVerification']>;
  documents?: DigitalProductPassport['documents'];
  authenticationVcId?: string;
  ownershipNftLink?: OwnershipNftLink;
  textileInformation?: TextileInformation;
  constructionProductInformation?: ConstructionProductInformation;
}


export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;
  const auth = validateApiKey(request);
  if (auth) return auth;

  const product = MOCK_DPPS.find(dpp => dpp.id === productId && !dpp.metadata.isArchived); // Exclude soft-deleted

  await new Promise(resolve => setTimeout(resolve, 200));

  if (product) {
    return NextResponse.json(product);
  } else {
    return NextResponse.json({ error: { code: 404, message: `Product with ID ${productId} not found or has been archived.` } }, { status: 404 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;
  const auth = validateApiKey(request);
  if (auth) return auth;
  let requestBody: UpdateDppRequestBody;

  try {
    requestBody = await request.json();
  } catch (error) {
    return NextResponse.json({ error: { code: 400, message: "Invalid JSON payload." } }, { status: 400 });
  }

  const productIndex = MOCK_DPPS.findIndex(dpp => dpp.id === productId && !dpp.metadata.isArchived); // Don't update archived

  await new Promise(resolve => setTimeout(resolve, 200));

  if (productIndex === -1) {
    return NextResponse.json({ error: { code: 404, message: `Product with ID ${productId} not found or has been archived.` } }, { status: 404 });
  }

  const existingProduct = MOCK_DPPS[productIndex];
  
  const updatedProduct: DigitalProductPassport = {
    ...existingProduct,
    ...(requestBody.productName && { productName: requestBody.productName }),
    ...(requestBody.category && { category: requestBody.category }),
    ...(requestBody.gtin && { gtin: requestBody.gtin }),
    ...(requestBody.manufacturerName && { manufacturer: { ...existingProduct.manufacturer, name: requestBody.manufacturerName } }),
    ...(requestBody.modelNumber && { modelNumber: requestBody.modelNumber }),
    ...(requestBody.authenticationVcId !== undefined && { authenticationVcId: requestBody.authenticationVcId }), 
    ...(requestBody.ownershipNftLink && { ownershipNftLink: requestBody.ownershipNftLink }), 
    metadata: {
      ...existingProduct.metadata,
      ...(requestBody.metadata || {}), 
      last_updated: new Date().toISOString(),
    },
    productDetails: {
      ...existingProduct.productDetails,
      ...(requestBody.productDetails || {}),
      customAttributes: requestBody.productDetails?.customAttributes || existingProduct.productDetails?.customAttributes || [],
    },
    compliance: {
      ...existingProduct.compliance,
      ...(requestBody.compliance || {}),
    },
    ebsiVerification: {
      ...existingProduct.ebsiVerification,
      ...(requestBody.ebsiVerification || {}),
      lastChecked: requestBody.ebsiVerification?.status ? new Date().toISOString() : existingProduct.ebsiVerification?.lastChecked || new Date().toISOString(),
    },
    documents: requestBody.documents || existingProduct.documents,
    textileInformation: requestBody.textileInformation || existingProduct.textileInformation,
    constructionProductInformation: requestBody.constructionProductInformation || existingProduct.constructionProductInformation,
  };

  MOCK_DPPS[productIndex] = updatedProduct;

  return NextResponse.json(updatedProduct);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;
  const auth = validateApiKey(request);
  if (auth) return auth;

  const productIndex = MOCK_DPPS.findIndex(dpp => dpp.id === productId);

  await new Promise(resolve => setTimeout(resolve, 150));

  if (productIndex === -1) {
    return NextResponse.json({ error: { code: 404, message: `Product with ID ${productId} not found for deletion.` } }, { status: 404 });
  }
  
  // Soft delete: set isArchived to true, keep original status
  MOCK_DPPS[productIndex].metadata.isArchived = true;
  MOCK_DPPS[productIndex].metadata.last_updated = new Date().toISOString();

  return NextResponse.json({ message: `Product with ID ${productId} has been archived successfully.` , statusMessage: "Archived (Soft Deleted)"}); // Keep user-facing message clear
}

