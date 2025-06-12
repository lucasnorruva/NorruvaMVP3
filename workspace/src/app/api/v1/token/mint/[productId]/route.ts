
// src/app/api/v1/token/mint/[productId]/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MOCK_DPPS } from '@/data';
import { validateApiKey } from '@/middleware/apiKeyAuth';
import type { DigitalProductPassport } from '@/types/dpp'; // Import DigitalProductPassport type

interface MintTokenRequestBody {
  contractAddress: string;
  recipientAddress: string;
  metadataUri?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  const { productId } = params;
  let body: MintTokenRequestBody;

  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ error: { code: 400, message: "Invalid JSON payload" } }, { status: 400 });
  }

  const { contractAddress, recipientAddress, metadataUri } = body;

  if (!contractAddress || !recipientAddress) {
    return NextResponse.json({ error: { code: 400, message: "Missing required fields: contractAddress, recipientAddress" } }, { status: 400 });
  }

  const productIndex = MOCK_DPPS.findIndex(dpp => dpp.id === productId); // Use findIndex
  if (productIndex === -1) {
    return NextResponse.json({ error: { code: 404, message: `Product with ID ${productId} not found.` } }, { status: 404 });
  }

  // Simulate minting
  await new Promise(resolve => setTimeout(resolve, 300));

  const mockTokenId = Math.floor(Math.random() * 100000).toString();
  const mockTransactionHash = `0xmint_tx_mock_${Date.now().toString(16)}`;
  
  // Conceptually, a metadataHash would be derived from metadataUri here before calling a smart contract.
  // For the mock, we're good.

  // Update the product's blockchainIdentifiers in MOCK_DPPS
  const productToUpdate: DigitalProductPassport = MOCK_DPPS[productIndex];
  productToUpdate.blockchainIdentifiers = {
    ...(productToUpdate.blockchainIdentifiers || {}), // Preserve existing identifiers like platform or anchor hash
    tokenId: mockTokenId,
    contractAddress: contractAddress,
    // platform: productToUpdate.blockchainIdentifiers?.platform || "MockTokenPlatform", // Platform is typically set during anchoring or known from contract
  };
  if (!productToUpdate.blockchainIdentifiers.platform) { // Set a default platform if none exists yet
    productToUpdate.blockchainIdentifiers.platform = "MockTokenPlatform (from mint)";
  }
  productToUpdate.metadata.last_updated = new Date().toISOString();
  MOCK_DPPS[productIndex] = productToUpdate; // Update the array

  return NextResponse.json({
    tokenId: mockTokenId,
    contractAddress: contractAddress,
    transactionHash: mockTransactionHash,
    message: `Mock token ${mockTokenId} minted for product ${productId} to ${recipientAddress}. Conceptual Metadata Hash derived from URI: ${metadataUri || 'N/A'}. DPP record updated.`,
  }, { status: 201 });
}

