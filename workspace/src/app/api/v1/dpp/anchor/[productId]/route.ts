
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MOCK_DPPS } from '@/data';
import type { DigitalProductPassport } from '@/types/dpp';
import { validateApiKey } from '@/middleware/apiKeyAuth';

interface AnchorDppRequestBody {
  platform: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;
  const auth = validateApiKey(request);
  if (auth) return auth;
  let requestBody: AnchorDppRequestBody;

  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json({ error: { code: 400, message: 'Invalid JSON payload.' } }, { status: 400 });
  }

  if (!requestBody.platform || requestBody.platform.trim() === '') {
    return NextResponse.json({ error: { code: 400, message: "Field 'platform' is required." } }, { status: 400 });
  }

  const index = MOCK_DPPS.findIndex(dpp => dpp.id === productId);

  await new Promise(resolve => setTimeout(resolve, 150));

  if (index === -1) {
    return NextResponse.json({ error: { code: 404, message: `Product with ID ${productId} not found.` } }, { status: 404 });
  }

  const anchorHash = `0xmockAnchor${Date.now().toString(16)}`;
  const existingIdentifiers = MOCK_DPPS[index].blockchainIdentifiers || {};
  
  const mockContractAddress = existingIdentifiers.contractAddress || `0xMOCK_CONTRACT_FOR_${productId}`;
  const mockTokenId = existingIdentifiers.tokenId || `MOCK_TID_${productId}_${Date.now().toString(36).slice(-4).toUpperCase()}`;

  const updated: DigitalProductPassport = {
    ...MOCK_DPPS[index],
    blockchainIdentifiers: {
      ...existingIdentifiers,
      platform: requestBody.platform,
      anchorTransactionHash: anchorHash,
      contractAddress: mockContractAddress, 
      tokenId: mockTokenId,                 
    },
    metadata: {
      ...MOCK_DPPS[index].metadata,
      last_updated: new Date().toISOString(),
    },
  };

  MOCK_DPPS[index] = updated;

  return NextResponse.json(updated);
}

