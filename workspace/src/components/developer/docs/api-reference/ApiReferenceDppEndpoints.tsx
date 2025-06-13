
import { Server } from "lucide-react";
import {
  ListDigitalProductPassports,
  RetrieveDigitalProductPassport,
  CreateDigitalProductPassport,
  UpdateDigitalProductPassport,
  ExtendDigitalProductPassport,
  AddLifecycleEventToDpp,
  ArchiveDigitalProductPassport,
  IssueDppAuthVc, 
  LinkDppOwnershipNft,
  AnchorDpp, 
} from "./index"; 
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson } from "lucide-react";

// Component for UpdateOnChainStatus
function UpdateDppOnChainStatus({ exampleRequestBody, exampleDppResponse, error400, error401, error404, error500 }: { exampleRequestBody: string; exampleDppResponse: string; error400: string; error401: string; error404: string; error500: string; }) {
  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Update DPP On-Chain Status</CardTitle>
        <CardDescription>
          <span className="inline-flex items-center font-mono text-sm">
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 mr-2 font-semibold">POST</Badge>
            <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/dpp/{"{productId}"}/onchain-status</code>
          </span>
          <br />
          Conceptually updates the on-chain status of a Digital Product Passport.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <section>
          <h4 className="font-semibold mb-1">Path Parameters</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">productId</code> (string, required): The unique identifier of the product.</li>
          </ul>
        </section>
        <section>
          <h4 className="font-semibold mb-1">Request Body (JSON) - UpdateOnChainStatusRequest</h4>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Request</summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{exampleRequestBody}</code></pre>
          </details>
        </section>
        <section>
          <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
          <p className="text-sm mb-1">Returns the updated DPP object with a confirmation message.</p>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response</summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{exampleDppResponse}</code></pre>
          </details>
        </section>
        <section>
          <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
          <ul className="list-disc list-inside text-sm space-y-2">
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">400 Bad Request</code>: Invalid status value or missing field.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.</li>
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}

// Component for UpdateOnChainLifecycleStage
function UpdateDppOnChainLifecycleStage({ exampleRequestBody, exampleDppResponse, error400, error401, error404, error500 }: { exampleRequestBody: string; exampleDppResponse: string; error400: string; error401: string; error404: string; error500: string; }) {
  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Update DPP On-Chain Lifecycle Stage</CardTitle>
        <CardDescription>
          <span className="inline-flex items-center font-mono text-sm">
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 mr-2 font-semibold">POST</Badge>
            <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/dpp/{"{productId}"}/onchain-lifecycle-stage</code>
          </span>
          <br />
          Conceptually updates the on-chain lifecycle stage of a Digital Product Passport.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
         <section>
          <h4 className="font-semibold mb-1">Path Parameters</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">productId</code> (string, required): The unique identifier of the product.</li>
          </ul>
        </section>
        <section>
          <h4 className="font-semibold mb-1">Request Body (JSON) - UpdateOnChainLifecycleStageRequest</h4>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Request</summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{exampleRequestBody}</code></pre>
          </details>
        </section>
        <section>
          <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
           <p className="text-sm mb-1">Returns the updated DPP object with a confirmation message.</p>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response</summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{exampleDppResponse}</code></pre>
          </details>
        </section>
         <section>
          <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
            <ul className="list-disc list-inside text-sm space-y-2">
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">400 Bad Request</code>: Invalid lifecycleStage value or missing field.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.</li>
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}

// Component for LogCriticalEvent
function LogDppCriticalEvent({ exampleRequestBody, exampleDppResponse, error400, error401, error404, error500 }: { exampleRequestBody: string; exampleDppResponse: string; error400: string; error401: string; error404: string; error500: string; }) {
  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Log Critical Event for a DPP</CardTitle>
        <CardDescription>
          <span className="inline-flex items-center font-mono text-sm">
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 mr-2 font-semibold">POST</Badge>
            <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/dpp/{"{productId}"}/log-critical-event</code>
          </span>
          <br />
          Conceptually logs a critical event on-chain for a specified DPP.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <section>
          <h4 className="font-semibold mb-1">Path Parameters</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">productId</code> (string, required): The unique identifier of the product.</li>
          </ul>
        </section>
        <section>
          <h4 className="font-semibold mb-1">Request Body (JSON) - LogCriticalEventRequest</h4>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Request</summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{exampleRequestBody}</code></pre>
          </details>
        </section>
        <section>
          <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
           <p className="text-sm mb-1">Returns the updated DPP object with a confirmation message.</p>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response</summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{exampleDppResponse}</code></pre>
          </details>
        </section>
         <section>
          <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
            <ul className="list-disc list-inside text-sm space-y-2">
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">400 Bad Request</code>: Missing eventDescription or invalid severity.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.</li>
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}

// Component for RegisterVcHash
function RegisterDppVcHash({ exampleRequestBody, exampleDppResponse, error400, error401, error404, error500 }: { exampleRequestBody: string; exampleDppResponse: string; error400: string; error401: string; error404: string; error500: string; }) {
  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Register Verifiable Credential Hash</CardTitle>
        <CardDescription>
          <span className="inline-flex items-center font-mono text-sm">
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 mr-2 font-semibold">POST</Badge>
            <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/dpp/{"{productId}"}/register-vc-hash</code>
          </span>
          <br />
          Conceptually registers a Verifiable Credential's hash on-chain for a DPP.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <section>
          <h4 className="font-semibold mb-1">Path Parameters</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">productId</code> (string, required): The unique identifier of the product.</li>
          </ul>
        </section>
        <section>
          <h4 className="font-semibold mb-1">Request Body (JSON) - RegisterVcHashRequest</h4>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Request</summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{exampleRequestBody}</code></pre>
          </details>
        </section>
        <section>
          <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
           <p className="text-sm mb-1">Returns the updated DPP object with a confirmation message.</p>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm"><FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response</summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96"><code>{exampleDppResponse}</code></pre>
          </details>
        </section>
         <section>
          <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
            <ul className="list-disc list-inside text-sm space-y-2">
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">400 Bad Request</code>: Missing vcId or vcHash.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code>.</li>
            <li><code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.</li>
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}


interface DppEndpointsProps {
  exampleListDppsResponse: string;
  exampleDppResponse: string;
  conceptualCreateDppRequestBody: string;
  conceptualCreateDppResponseBody: string;
  conceptualUpdateDppRequestBody: string;
  conceptualUpdateDppResponseBody: string;
  conceptualDeleteDppResponseBody: string;
  conceptualPatchDppExtendRequestBody: string;
  conceptualPatchDppExtendResponseBody: string;
  addLifecycleEventRequestBodyExample: string;
  addLifecycleEventResponseExample: string;
  exampleUpdateOnChainStatusRequestBody: string;
  exampleUpdateOnChainLifecycleStageRequestBody: string;
  exampleLogCriticalEventRequestBody: string;
  exampleRegisterVcHashRequestBody: string;
  exampleUpdatedDppResponse: string; 
  exampleAnchorDppResponse: string; 
  error401: string;
  error404: string;
  error500: string;
  error400_create_dpp: string;
  error400_update_dpp: string;
  error400_patch_dpp: string;
  error400_lifecycle_event: string;
  error400_general: string;
}

export default function ApiReferenceDppEndpoints(props: DppEndpointsProps) {
  return (
    <section id="dpp-endpoints">
      <h2 className="text-2xl font-semibold font-headline mt-8 mb-4 flex items-center">
        <Server className="mr-3 h-6 w-6 text-primary" /> Digital Product
        Passport (DPP) Endpoints
      </h2>
      <ListDigitalProductPassports
        exampleListDppsResponse={props.exampleListDppsResponse}
        error401={props.error401}
        error500={props.error500}
      />
      <RetrieveDigitalProductPassport
        exampleDppResponse={props.exampleDppResponse}
        error401={props.error401}
        error404={props.error404}
        error500={props.error500}
      />
      <CreateDigitalProductPassport
        conceptualCreateDppRequestBody={props.conceptualCreateDppRequestBody}
        conceptualCreateDppResponseBody={props.conceptualCreateDppResponseBody}
        error400_create_dpp={props.error400_create_dpp}
        error401={props.error401}
        error500={props.error500}
      />
      <UpdateDigitalProductPassport
        conceptualUpdateDppRequestBody={props.conceptualUpdateDppRequestBody}
        conceptualUpdateDppResponseBody={props.conceptualUpdateDppResponseBody}
        error400_update_dpp={props.error400_update_dpp}
        error401={props.error401}
        error404={props.error404}
        error500={props.error500}
      />
      <ExtendDigitalProductPassport
        conceptualPatchDppExtendRequestBody={
          props.conceptualPatchDppExtendRequestBody
        }
        conceptualPatchDppExtendResponseBody={
          props.conceptualPatchDppExtendResponseBody
        }
        error400_patch_dpp={props.error400_patch_dpp}
      />
      <AddLifecycleEventToDpp
        addLifecycleEventRequestBodyExample={
          props.addLifecycleEventRequestBodyExample
        }
        addLifecycleEventResponseExample={
          props.addLifecycleEventResponseExample
        }
        error400_lifecycle_event={props.error400_lifecycle_event}
      />
      <ArchiveDigitalProductPassport
        conceptualDeleteDppResponseBody={props.conceptualDeleteDppResponseBody}
        error401={props.error401}
        error404={props.error404}
        error500={props.error500}
      />
      <AnchorDpp
        exampleAnchorDppResponse={props.exampleAnchorDppResponse} 
        error400={props.error400_general}
        error401={props.error401}
        error404={props.error404}
        error500={props.error500}
      />
      <IssueDppAuthVc
        exampleDppResponse={props.exampleUpdatedDppResponse}
        error401={props.error401}
        error404={props.error404}
        error500={props.error500}
      />
      <LinkDppOwnershipNft
        exampleDppResponse={props.exampleUpdatedDppResponse}
        error400={props.error400_general}
        error401={props.error401}
        error404={props.error404}
        error500={props.error500}
      />
      <UpdateDppOnChainStatus
        exampleRequestBody={props.exampleUpdateOnChainStatusRequestBody}
        exampleDppResponse={props.exampleUpdatedDppResponse}
        error400={props.error400_general}
        error401={props.error401}
        error404={props.error404}
        error500={props.error500}
      />
      <UpdateDppOnChainLifecycleStage
        exampleRequestBody={props.exampleUpdateOnChainLifecycleStageRequestBody}
        exampleDppResponse={props.exampleUpdatedDppResponse}
        error400={props.error400_general}
        error401={props.error401}
        error404={props.error404}
        error500={props.error500}
      />
      <LogDppCriticalEvent
        exampleRequestBody={props.exampleLogCriticalEventRequestBody}
        exampleDppResponse={props.exampleUpdatedDppResponse}
        error400={props.error400_general}
        error401={props.error401}
        error404={props.error404}
        error500={props.error500}
      />
      <RegisterDppVcHash
        exampleRequestBody={props.exampleRegisterVcHashRequestBody}
        exampleDppResponse={props.exampleUpdatedDppResponse}
        error400={props.error400_general}
        error401={props.error401}
        error404={props.error404}
        error500={props.error500}
      />
    </section>
  );
}

ApiReferenceDppEndpoints.defaultProps = {
  error400_general: JSON.stringify({ error: { code: 400, message: "Invalid request body or parameters." } }, null, 2)
};

```
- workspace/src/components/developer/docs/api-reference/index.ts:
```tsx

export { default as ListDigitalProductPassports } from './ListDigitalProductPassports';
export { default as RetrieveDigitalProductPassport } from './RetrieveDigitalProductPassport';
export { default as CreateDigitalProductPassport } from './CreateDigitalProductPassport';
export { default as UpdateDigitalProductPassport } from './UpdateDigitalProductPassport';
export { default as ExtendDigitalProductPassport } from './ExtendDigitalProductPassport';
export { default as AddLifecycleEventToDpp } from './AddLifecycleEventToDpp';
export { default as ArchiveDigitalProductPassport } from './ArchiveDigitalProductPassport';
export { default as ApiReferencePrivateLayerEndpoints } from './ApiReferencePrivateLayerEndpoints';
export { default as ApiReferenceZkpLayerEndpoints } from './ApiReferenceZkpLayerEndpoints'; 
export { default as IssueDppAuthVc } from './IssueDppAuthVc';
export { default as LinkDppOwnershipNft } from './LinkDppOwnershipNft';
export { default as ApiReferenceGraphEndpoints } from './ApiReferenceGraphEndpoints';
export { default as AnchorDpp } from './AnchorDpp'; 

// Ensure ApiReferenceDppEndpoints is also exported if it's the main aggregator,
// or export the new components directly if they are separate files.
// For now, assuming they are part of ApiReferenceDppEndpoints.tsx or similar structure.
// If UpdateDppOnChainStatus, etc., are separate components, export them:
// export { default as UpdateDppOnChainStatus } from './UpdateDppOnChainStatus';
// ... and so on for other new endpoint docs.

// However, the current plan seems to integrate these into ApiReferenceDppEndpoints.tsx,
// so no new exports might be needed here unless that structure changes.
export { default as ApiReferenceDppEndpoints } from './ApiReferenceDppEndpoints';


```
- workspace/src/components/products/detail/HistoryTab.tsx:
```tsx

// --- File: HistoryTab.tsx ---
// Description: Displays product-specific history/audit trail.
"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle, History as HistoryIconLucide, User, Edit, CalendarDays, Info as InfoIcon, FileText, ShieldCheck, CheckCircle, Layers, PlusCircle, Anchor, FileCog, UploadCloud, Link as LinkIconPath, Tag, KeyRound, Layers3, Sigma, MessageSquareWarning, Hash, FileLock } from 'lucide-react';
import type { HistoryEntry } from '@/types/dpp';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface HistoryTabProps {
  productId: string;
}

const getActionIcon = (actionType: string): React.ElementType => {
  const lowerAction = actionType.toLowerCase();
  if (lowerAction.includes("created")) return PlusCircle;
  if (lowerAction.includes("lifecycle")) return Layers;
  if (lowerAction.includes("certif")) return Award;
  if (lowerAction.includes("ebsi")) return ShieldCheck;
  if (lowerAction.includes("status") && !lowerAction.includes("onchain")) return Edit; // General status update
  if (lowerAction.includes("anchor")) return Anchor;
  if (lowerAction.includes("ownership") && !lowerAction.includes("nft")) return User;
  if (lowerAction.includes("document")) return FileText;
  if (lowerAction.includes("vc hash")) return Hash;
  if (lowerAction.includes("critical")) return MessageSquareWarning;
  if (lowerAction.includes("auth vc")) return FileLock;
  if (lowerAction.includes("nft link")) return Tag;
  if (lowerAction.includes("onchainstatusupdate")) return Sigma; 
  if (lowerAction.includes("onchainlifecyclestageupdate")) return Layers3; 
  return Edit; // Default icon
};

export default function HistoryTab({ productId }: HistoryTabProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      setIsLoading(true);
      setError(null);
      try {
        // Use API key for fetching history if your middleware is set up for it
        const apiKey = process.env.NEXT_PUBLIC_MOCK_API_KEY || "SANDBOX_KEY_123";
        const response = await fetch(`/api/v1/dpp/history/${productId}`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || `Failed to fetch history: ${response.status}`);
        }
        const data: HistoryEntry[] = await response.json();
        setHistory(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(message);
        console.error("Error fetching product history:", err);
      } finally {
        setIsLoading(false);
      }
    }
    if (productId) {
      fetchHistory();
    }
  }, [productId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading product history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading History</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <HistoryIconLucide className="mr-2 h-5 w-5 text-primary" /> Product History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No historical events recorded for this product.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <HistoryIconLucide className="mr-2 h-5 w-5 text-primary" /> Product DPP History & Audit Trail
        </CardTitle>
        <CardDescription>Conceptual audit trail of changes and significant events for this product passport.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-3"> 
          <div className="relative pl-5 space-y-6">
            {/* Vertical timeline bar */}
            <div className="absolute left-[calc(0.625rem-1px)] top-2 bottom-2 w-0.5 bg-border rounded-full -translate-x-1/2"></div>

            {history.map((entry, index) => {
              const ActionIcon = getActionIcon(entry.actionType);
              return (
                <div key={`${entry.timestamp}-${index}`} className="relative flex items-start">
                  <div className="absolute left-0 top-1 flex items-center justify-center w-5 h-5 bg-card border-2 border-primary rounded-full -translate-x-1/2 z-10">
                    <ActionIcon className="h-2.5 w-2.5 text-primary" />
                  </div>
                  <div className="ml-6 w-full p-3 border rounded-md bg-background hover:shadow-sm transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1">
                      <h4 className="font-medium text-sm text-foreground flex items-center">
                        {entry.actionType}
                      </h4>
                      <Badge variant="outline" className="mt-1 sm:mt-0 text-xs px-1.5 py-0.5">
                        Version: {entry.version || 'N/A'}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mb-1.5 flex flex-wrap gap-x-3 gap-y-0.5">
                      <span className="flex items-center">
                        <CalendarDays className="h-3 w-3 mr-1 text-muted-foreground/80"/>
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1 text-muted-foreground/80"/>
                        By: {entry.changedBy}
                      </span>
                    </div>
                    {entry.details && (
                        <TooltipProvider delayDuration={150}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="text-xs text-foreground/90 p-1.5 bg-muted/30 rounded-sm whitespace-pre-line truncate cursor-help">
                                  <InfoIcon className="inline h-3.5 w-3.5 mr-1 text-info align-text-bottom"/>
                                  {entry.details.length > 100 ? `${entry.details.substring(0, 100)}...` : entry.details}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-md bg-popover text-popover-foreground shadow-lg rounded-md p-2 border">
                              <p className="text-xs whitespace-pre-line">{entry.details}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

```
- workspace/src/components/products/detail/ProductContainer.tsx:
```tsx

// --- File: ProductContainer.tsx ---
// Description: Main layout component for the product detail view, managing tabs.
"use client";

import { useState } from "react";
import type { SimpleProductDetail, ProductSupplyChainLink } from "@/types/dpp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductHeader from "./ProductHeader";
import OverviewTab from "./OverviewTab";
import SustainabilityTab from './SustainabilityTab';
import ComplianceTab from './ComplianceTab';
import LifecycleTab from './LifecycleTab';
import SupplyChainTab from './SupplyChainTab';
import CertificationsTab from './CertificationsTab';
import QrCodeTab from './QrCodeTab';
import HistoryTab from './HistoryTab'; // Import the new HistoryTab

import { Package, Leaf, ShieldCheck, History as HistoryIcon, Layers, Award, QrCode, ListChecks } from 'lucide-react'; // Changed History to ListChecks


interface ProductContainerProps {
  product: SimpleProductDetail;
  onSupplyChainUpdate: (updatedLinks: ProductSupplyChainLink[]) => void;
  onSyncEprel: () => Promise<void>;
  isSyncingEprel: boolean;
  canSyncEprel: boolean; 
}

export default function ProductContainer({ 
  product, 
  onSupplyChainUpdate,
  onSyncEprel,
  isSyncingEprel,
  canSyncEprel 
}: ProductContainerProps) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!product) {
    return <p>Product not found.</p>;
  }
  
  const tabItems = [
    { value: "overview", label: "Overview", icon: Package },
    { value: "sustainability", label: "Sustainability", icon: Leaf },
    { value: "compliance", label: "Compliance", icon: ShieldCheck },
    { value: "certifications", label: "Certifications", icon: Award },
    { value: "lifecycle", label: "Lifecycle", icon: HistoryIcon },
    { value: "supplyChain", label: "Supply Chain", icon: Layers },
    { value: "history", label: "History", icon: ListChecks }, // Changed icon for History
    { value: "qrCode", label: "QR Code", icon: QrCode },
  ];

  return (
    <div className="space-y-6">
      <ProductHeader product={product} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2 h-auto p-1.5"> {/* Adjusted grid columns */}
          {tabItems.map(tab => (
            <TabsTrigger 
              key={tab.value} 
              value={tab.value} 
              className="flex items-center gap-2 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              <tab.icon className="h-4 w-4" /> {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab product={product} />
        </TabsContent>

        <TabsContent value="sustainability" className="mt-6">
          <SustainabilityTab product={product} />
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <ComplianceTab 
            product={product} 
            onSyncEprel={onSyncEprel}
            isSyncingEprel={isSyncingEprel}
            canSyncEprel={canSyncEprel}
          />
        </TabsContent>
        
        <TabsContent value="certifications" className="mt-6">
          <CertificationsTab product={product} />
        </TabsContent>

        <TabsContent value="lifecycle" className="mt-6">
          <LifecycleTab product={product} />
        </TabsContent>

         <TabsContent value="supplyChain" className="mt-6">
          <SupplyChainTab product={product} onSupplyChainLinksChange={onSupplyChainUpdate} />
        </TabsContent>

        <TabsContent value="history" className="mt-6"> {/* Added TabsContent for History */}
          <HistoryTab productId={product.id} />
        </TabsContent>

        <TabsContent value="qrCode" className="mt-6"> 
          <QrCodeTab productId={product.id} productName={product.productName} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
    

```

The `LifecycleTab.tsx` and `CertificationsTab.tsx` have been redesigned for a more comprehensive and advanced look.
*   **Lifecycle Tab:** Now presents a more structured vertical timeline with icons, dates, locations, details, and status badges for each event. The "Simulate Advance & Compliance" button is also included.
*   **Certifications Tab:** Each certification is in its own card, with clear visual distinction for verified status and display of standard, VC ID (with tooltip), transaction hash (with tooltip), and document links.
*   **Mock Data (`MOCK_DPPS`):** Updated for DPP001 to include richer `lifecycleEvents` and `certifications` (with `vcId` and `transactionHash`) to better showcase the new tab designs.

The other tabs (`SustainabilityTab`, `ComplianceTab`, `SupplyChainTab`) can be enhanced in subsequent steps if desired.