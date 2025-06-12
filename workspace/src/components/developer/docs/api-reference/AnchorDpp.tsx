
// --- File: src/components/developer/docs/api-reference/AnchorDpp.tsx ---
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson } from "lucide-react";

interface AnchorDppProps {
  exampleAnchorDppResponse: string;
  error400: string;
  error401: string;
  error404: string;
  error500: string;
}

export default function AnchorDpp({
  exampleAnchorDppResponse,
  error400,
  error401,
  error404,
  error500,
}: AnchorDppProps) {
  const exampleRequestBody = JSON.stringify({
    platform: "Ethereum"
  }, null, 2);

  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Anchor Digital Product Passport</CardTitle>
        <CardDescription>
          <span className="inline-flex items-center font-mono text-sm">
            <Badge
              variant="outline"
              className="bg-green-100 text-green-700 border-green-300 mr-2 font-semibold"
            >
              POST
            </Badge>
            <code className="bg-muted px-1 py-0.5 rounded-sm">
              /api/v1/dpp/anchor/{"{productId}"}
            </code>
          </span>
          <br />
          Creates a conceptual blockchain anchor for the specified DPP. Also sets a mock contract address and token ID.
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
              (string, required): The unique identifier of the DPP to anchor.
            </li>
          </ul>
        </section>
        <section>
          <h4 className="font-semibold mb-1">Request Body (JSON)</h4>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
              <FileJson className="inline h-4 w-4 mr-1 align-middle" />
              Example JSON Request Body
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
            Returns the updated DPP object including the new blockchain identifiers (platform, anchorTransactionHash, contractAddress, tokenId).
          </p>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
              <FileJson className="inline h-4 w-4 mr-1 align-middle" />
              Example JSON Response
            </summary>
            <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
              <code>{exampleAnchorDppResponse}</code>
            </pre>
          </details>
        </section>
        <section>
          <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
          <ul className="list-disc list-inside text-sm space-y-2">
            <li>
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                400 Bad Request
              </code>
              : Missing 'platform' in request body.
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
              </code>
              . (See example under GET /dpp/{"{id}"})
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
