
// --- File: src/components/developer/docs/api-reference/ApiReferenceGraphEndpoints.tsx ---
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson, Server, Share2 } from "lucide-react"; // Using Share2 for graph-like icon

interface ApiReferenceGraphEndpointsProps {
  exampleGraphResponse: string;
  error401: string;
  error404: string;
  error500: string;
}

export default function ApiReferenceGraphEndpoints({
  exampleGraphResponse,
  error401,
  error404,
  error500,
}: ApiReferenceGraphEndpointsProps) {
  return (
    <section id="graph-endpoints" className="mt-8">
      <h2 className="text-2xl font-semibold font-headline mt-8 mb-4 flex items-center">
        <Share2 className="mr-3 h-6 w-6 text-primary" /> DPP Graph Data Endpoint
      </h2>
      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Retrieve Graph Data for a DPP</CardTitle>
          <CardDescription>
            <span className="inline-flex items-center font-mono text-sm">
              <Badge variant="outline" className="bg-sky-100 text-sky-700 border-sky-300 mr-2 font-semibold">GET</Badge>
              <code className="bg-muted px-1 py-0.5 rounded-sm">/api/v1/dpp/graph/{"{productId}"}</code>
            </span>
            <br />
            Fetches graph data (nodes and edges) for visualizing the supply chain or lifecycle related to a DPP.
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
            <h4 className="font-semibold mb-1">Example Response (Success 200 OK)</h4>
            <p className="text-sm mb-1">Returns a DppGraphResponse object containing arrays of nodes and edges.</p>
            <details className="border rounded-md">
              <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
                <FileJson className="inline h-4 w-4 mr-1 align-middle" />Example JSON Response
              </summary>
              <pre className="bg-muted/50 p-3 rounded-b-md text-xs overflow-x-auto max-h-96">
                <code>{exampleGraphResponse}</code>
              </pre>
            </details>
          </section>
          <section>
            <h4 className="font-semibold mb-1 mt-3">Common Error Responses</h4>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">401 Unauthorized</code>.
                <details className="border rounded-md mt-1"><summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary><pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error401}</code></pre></details>
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">404 Not Found</code> (Product not found).
                <details className="border rounded-md mt-1"><summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary><pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error404}</code></pre></details>
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">500 Internal Server Error</code>.
                <details className="border rounded-md mt-1"><summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">Example JSON</summary><pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4"><code>{error500}</code></pre></details>
              </li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </section>
  );
}

