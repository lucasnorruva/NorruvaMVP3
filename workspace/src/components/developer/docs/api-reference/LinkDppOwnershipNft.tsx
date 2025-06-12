
// --- File: src/components/developer/docs/api-reference/LinkDppOwnershipNft.tsx ---
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson } from "lucide-react";

interface LinkDppOwnershipNftProps {
  exampleDppResponse: string; // For the updated product
  error400: string; // General 400 for missing fields
  error401: string;
  error404: string;
  error500: string;
}

export default function LinkDppOwnershipNft({
  exampleDppResponse,
  error400,
  error401,
  error404,
  error500,
}: LinkDppOwnershipNftProps) {
  const exampleRequestBody = JSON.stringify({
    registryUrl: "https://mock-nft-market.example/token/0xContract/123",
    contractAddress: "0xMockNFTContractAddressForDPP",
    tokenId: "123",
    chainName: "MockEthereum"
  }, null, 2);

  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Link Ownership NFT to DPP</CardTitle>
        <CardDescription>
          <span className="inline-flex items-center font-mono text-sm">
            <Badge
              variant="outline"
              className="bg-green-100 text-green-700 border-green-300 mr-2 font-semibold"
            >
              POST
            </Badge>
            <code className="bg-muted px-1 py-0.5 rounded-sm">
              /api/v1/dpp/{"{productId}"}/link-nft
            </code>
          </span>
          <br />
          Conceptually links an NFT representing product ownership to the specified Digital Product Passport.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <section>
          <h4 className="font-semibold mb-1">Path Parameters</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                productId
              </code>{" "}
              (string, required): The unique identifier of the product.
            </li>
          </ul>
        </section>
        <section>
          <h4 className="font-semibold mb-1">Request Body (JSON) - OwnershipNftLinkRequestBody</h4>
           <p className="text-sm mb-1">Requires <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">contractAddress</code> and <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">tokenId</code>. Registry URL and chainName are optional.</p>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
              <FileJson className="inline h-4 w-4 mr-1 align-middle" />
              Example JSON Request
            </summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
              <code>{exampleRequestBody}</code>
            </pre>
          </details>
        </section>
        <section>
          <h4 className="font-semibold mb-1">
            Example Response (Success 200 OK)
          </h4>
          <p className="text-sm mb-1">
            Returns a confirmation message, the product ID, the linked NFT details, and the updated DPP object.
          </p>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
              <FileJson className="inline h-4 w-4 mr-1 align-middle" />
              Example JSON Response
            </summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
              <code>{exampleDppResponse}</code>
            </pre>
          </details>
        </section>
        <section>
          <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
          <ul className="list-disc list-inside text-sm space-y-2">
            <li>
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                400 Bad Request
              </code>{" "}
              (e.g., missing contractAddress or tokenId).
              <details className="border rounded-md mt-1">
                <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">
                  Example JSON
                </summary>
                <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4">
                  <code>{error400}</code>
                </pre>
              </details>
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                401 Unauthorized
              </code>
              . (See example under GET /dpp/{"{id}"})
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                404 Not Found
              </code>{" "}
              (Product not found).
              <details className="border rounded-md mt-1">
                <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">
                  Example JSON
                </summary>
                <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4">
                  <code>{error404}</code>
                </pre>
              </details>
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                500 Internal Server Error
              </code>
              . (See example under GET /dpp/{"{id}"})
            </li>
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}
