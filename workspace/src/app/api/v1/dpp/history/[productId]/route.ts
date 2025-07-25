
// --- File: src/app/api/v1/dpp/history/[productId]/route.ts ---
// Description: Conceptual API endpoint to retrieve a history/audit trail for a DPP.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateApiKey } from '@/middleware/apiKeyAuth';
import { MOCK_DPPS } from '@/data';
import type { DigitalProductPassport, LifecycleEvent, Certification, EbsiVerificationDetails, HistoryEntry, SupplyChainStep, DocumentReference } from '@/types/dpp';

// Helper to create a history entry, ensuring timestamp is valid
const createHistoryEntry = (
    timestamp: string | undefined,
    actionType: string,
    details: string,
    changedBy: string
): Omit<HistoryEntry, 'version'> | null => {
    // Use a very old default if timestamp is undefined but details exist, otherwise skip if invalid
    const validTimestamp = (timestamp && !isNaN(new Date(timestamp).getTime())) 
                           ? timestamp 
                           : (!timestamp && details) ? "1970-01-01T00:00:00Z" : null;
    
    if (!validTimestamp) {
        console.warn(`Skipping history entry due to invalid/missing timestamp. Action: ${actionType}, Details: ${details}`);
        return null; 
    }
    return { timestamp: validTimestamp, actionType, details, changedBy };
};


export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;
  const auth = validateApiKey(request);
  if (auth) return auth;

  const product = MOCK_DPPS.find(dpp => dpp.id === productId);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150));

  if (!product) {
    return NextResponse.json({ error: { code: 404, message: `Product with ID ${productId} not found.` } }, { status: 404 });
  }

  const potentialHistory: Array<Omit<HistoryEntry, 'version'>> = [];
  let maxEventTimestamp = 0; // Used to determine if a generic "DPP Data Updated" is needed

  // Initial creation
  const creationTimestamp = product.metadata.created_at || product.metadata.last_updated;
  const creationEntry = createHistoryEntry(creationTimestamp, "DPP Created", `Initial version of DPP for ${product.productName}. Status: ${product.metadata.status}.`, "System/Initial Importer");
  if (creationEntry) {
    potentialHistory.push(creationEntry);
    maxEventTimestamp = Math.max(maxEventTimestamp, new Date(creationEntry.timestamp).getTime());
  }
  
  // Lifecycle events from product.lifecycleEvents
  if (product.lifecycleEvents && product.lifecycleEvents.length > 0) {
    product.lifecycleEvents.forEach((event: LifecycleEvent) => {
      const entry = createHistoryEntry(
        event.timestamp,
        `Lifecycle Event: ${event.type}`,
        `${event.location ? `Location: ${event.location}. ` : ''}${event.data ? `Data: ${JSON.stringify(event.data || {})}. ` : ''}${event.transactionHash ? `Tx: ${event.transactionHash.substring(0,10)}...` : ''}`,
        event.responsibleParty || "System Update"
      );
      if (entry) {
        potentialHistory.push(entry);
        maxEventTimestamp = Math.max(maxEventTimestamp, new Date(entry.timestamp).getTime());
      }
    });
  }
  
  // Certifications as history events
  if (product.certifications && product.certifications.length > 0) {
    product.certifications.forEach((cert: Certification) => {
      const entry = createHistoryEntry(
        cert.issueDate, 
        "Certification Added/Updated",
        `Certification '${cert.name}' by ${cert.issuer}. Standard: ${cert.standard || 'N/A'}.${cert.vcId ? ` VC ID: ${cert.vcId.substring(0,10)}...` : ''}${cert.transactionHash ? ` Tx: ${cert.transactionHash.substring(0,10)}...` : ''}`,
        "Compliance Team (Mock)"
      );
      if (entry) {
        potentialHistory.push(entry);
        maxEventTimestamp = Math.max(maxEventTimestamp, new Date(entry.timestamp).getTime());
      }
    });
  }

  // EBSI Verification Status Update
  if (product.ebsiVerification && product.ebsiVerification.lastChecked) {
    const ebsi = product.ebsiVerification;
    const entry = createHistoryEntry(
        ebsi.lastChecked,
        "EBSI Verification Status Update",
        `EBSI status changed to ${ebsi.status}.${ebsi.verificationId ? ` Verification ID: ${ebsi.verificationId}` : ''}${ebsi.message ? ` Message: ${ebsi.message}` : ''}`,
        "System/EBSI Interface"
    );
    if(entry) {
        potentialHistory.push(entry);
        maxEventTimestamp = Math.max(maxEventTimestamp, new Date(entry.timestamp).getTime());
    }
  }

  // Blockchain Identifiers (Conceptual Anchor Event)
  if (product.blockchainIdentifiers?.anchorTransactionHash && product.metadata.last_updated) { 
    const entry = createHistoryEntry(
        product.metadata.last_updated, // Assume anchor happens around last update if no specific anchor time
        "DPP Anchored to Blockchain",
        `Product DPP anchored on platform ${product.blockchainIdentifiers.platform || 'Unknown'}. Tx: ${product.blockchainIdentifiers.anchorTransactionHash.substring(0,15)}...`,
        "System (Blockchain Service)"
    );
    if(entry) potentialHistory.push(entry);
  }
  
  // Conceptual On-Chain Status Update
  if (product.metadata.onChainStatus && product.metadata.onChainStatus !== "Unknown" && product.metadata.last_updated) {
    const entry = createHistoryEntry(
      product.metadata.last_updated, // Assume this update coincides with last_updated
      "OnChainStatusUpdate",
      `Conceptual on-chain status set to: ${product.metadata.onChainStatus}.`,
      "System/Admin Action (Blockchain Mgmt)"
    );
    if (entry) potentialHistory.push(entry);
  }

  // Conceptual On-Chain Lifecycle Stage Update
  if (product.metadata.onChainLifecycleStage && product.metadata.onChainLifecycleStage !== "Unknown" && product.metadata.last_updated) {
    const entry = createHistoryEntry(
      product.metadata.last_updated, // Assume this update coincides with last_updated
      "OnChainLifecycleStageUpdate",
      `Conceptual on-chain lifecycle stage set to: ${product.metadata.onChainLifecycleStage}.`,
      "System/Admin Action (Blockchain Mgmt)"
    );
    if (entry) potentialHistory.push(entry);
  }

  // Ownership NFT Link
  if (product.ownershipNftLink && product.metadata.last_updated) { 
    const entry = createHistoryEntry(
        product.metadata.last_updated, // Assume link happens around last update
        "Ownership NFT Linked",
        `NFT (Token ID: ${product.ownershipNftLink.tokenId || 'N/A'}, Contract: ${(product.ownershipNftLink.contractAddress || 'N/A').substring(0,10)}...) linked.`,
        "System/User Action"
    );
    if(entry) potentialHistory.push(entry);
  }
  
  // Auth VC Issued
  if (product.authenticationVcId && product.metadata.last_updated) {
    const entry = createHistoryEntry(
        product.metadata.last_updated, // Assume issuance coincides with last_updated
        "Authentication VC Issued",
        `Authentication VC (ID: ${product.authenticationVcId.substring(0,15)}...) conceptually issued.`,
        "System/User Action"
    );
    if(entry) potentialHistory.push(entry);
  }

  // Documents added
  if (product.documents && product.documents.length > 0) {
    product.documents.forEach((doc: DocumentReference) => {
      const entry = createHistoryEntry(
        doc.addedTimestamp,
        "Document Added",
        `Document '${doc.name}' (Type: ${doc.type}) added. URL: ${doc.url.substring(0,30)}...`,
        "User/System"
      );
      if (entry) {
        potentialHistory.push(entry);
        maxEventTimestamp = Math.max(maxEventTimestamp, new Date(entry.timestamp).getTime());
      }
    });
  }

  // Supply Chain Steps
  if (product.traceability?.supplyChainSteps && product.traceability.supplyChainSteps.length > 0) {
    product.traceability.supplyChainSteps.forEach((step: SupplyChainStep) => {
      const entry = createHistoryEntry(
        step.timestamp,
        `Supply Chain: ${step.stepName}`,
        `Actor: ${step.actorDid || 'N/A'}. Location: ${step.location || 'N/A'}.${step.transactionHash ? ` Tx: ${step.transactionHash.substring(0,10)}...` : ''}`,
        "Supply Chain Partner (Mock)"
      );
      if (entry) {
        potentialHistory.push(entry);
        maxEventTimestamp = Math.max(maxEventTimestamp, new Date(entry.timestamp).getTime());
      }
    });
  }
  
  // General updates based on last_updated (if significantly different from creation/last event)
  const productLastUpdatedTime = new Date(product.metadata.last_updated).getTime();
  if (productLastUpdatedTime > maxEventTimestamp) {
     if (productLastUpdatedTime - maxEventTimestamp > 60000) { // e.g., more than 1 minute after last known event
        const entry = createHistoryEntry(
            product.metadata.last_updated,
            "DPP Data Updated", 
            `Product information was updated. Current status: ${product.metadata.status}.`,
            "User/System (Generic Update)"
        );
        if(entry) potentialHistory.push(entry);
     }
  }
  
  const validHistoryEntries = potentialHistory.filter(entry => entry !== null) as Array<Omit<HistoryEntry, 'version'>>;
  // Sort by timestamp ascending to assign versions correctly
  validHistoryEntries.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const versionedHistory: HistoryEntry[] = validHistoryEntries.map((entry, index) => ({
    ...entry,
    version: index + 1, // Assign version based on chronological order
  }));
  
  // Finally, sort by timestamp descending for display (most recent first)
  versionedHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return NextResponse.json(versionedHistory);
}

