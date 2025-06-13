
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ethers } from 'ethers';
import { DPP_TOKEN_ADDRESS } from '@/config/contractAddresses';
import { validateApiKey } from '@/middleware/apiKeyAuth';

// Conceptual ABI - replace with actual partial ABI if available for specific functions
// For example, the actual mint function in DPPToken.sol is:
// function mint(address to, uint256 tokenId, string memory metadataHash)
const dppTokenAbi = [
  "function mint(address to, uint256 tokenId, string memory metadataHash)"
]; 

const dppTokenAddress = DPP_TOKEN_ADDRESS;

export async function POST(request: NextRequest) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { recipient, metadataHash, tokenId } = body; // Assuming tokenId might also be passed or derived

    if (!recipient || !metadataHash || tokenId === undefined) { // Check tokenId existence
      return NextResponse.json({ error: 'Recipient, metadataHash, and tokenId are required parameters.' }, { status: 400 });
    }

    const providerUrl = process.env.RPC_URL;
    const privateKey = process.env.PRIVATE_KEY;

    if (!providerUrl || !privateKey) {
      console.error('Missing RPC_URL or PRIVATE_KEY environment variables for mint route.');
      return NextResponse.json({ error: 'Server configuration error for blockchain interaction.' }, { status: 500 });
    }
    
    if (dppTokenAddress === "YOUR_DEPLOYED_DPP_TOKEN_PROXY_ADDRESS") {
        console.warn("[MINT API] DPPToken contract address is a placeholder. Real minting will fail. Returning mock success.");
        // Return a mock success for now to avoid blocking if only placeholder is present
        return NextResponse.json({ 
            message: 'DPP minted successfully (MOCK - Contract address is placeholder)', 
            transactionHash: `0xmocktx_${Date.now()}`,
            tokenId: tokenId 
        }, { status: 200 });
    }

    const provider = new ethers.JsonRpcProvider(providerUrl);
    const signer = new ethers.Wallet(privateKey, provider);
    const dppToken = new ethers.Contract(dppTokenAddress, dppTokenAbi, signer);

    console.log(`[MINT API] Attempting to mint DPP for recipient: ${recipient} with metadataHash: ${metadataHash} for tokenId: ${tokenId} using contract at ${dppTokenAddress}`);

    const tx = await dppToken.mint(recipient, tokenId, metadataHash);
    await tx.wait(); 

    return NextResponse.json({ message: 'DPP minted successfully', transactionHash: tx.hash, tokenId: tokenId }, { status: 200 });

  } catch (error: any) {
    console.error('[MINT API] Error minting DPP:', error);
    return NextResponse.json({ error: 'Failed to initiate minting process', details: error.message || String(error) }, { status: 500 });
  }
}
