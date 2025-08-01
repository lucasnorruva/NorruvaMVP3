import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileJson } from "lucide-react";

interface RetrieveDigitalProductPassportProps {
  exampleDppResponse: string;
  error401: string;
  error404: string;
  error500: string;
}

export default function RetrieveDigitalProductPassport({
  exampleDppResponse,
  error401,
  error404,
  error500,
}: RetrieveDigitalProductPassportProps) {
  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-lg">
          Retrieve a Digital Product Passport
        </CardTitle>
        <CardDescription>
          <span className="inline-flex items-center font-mono text-sm">
            <Badge
              variant="outline"
              className="bg-sky-100 text-sky-700 border-sky-300 mr-2 font-semibold"
            >
              GET
            </Badge>
            <code className="bg-muted px-1 py-0.5 rounded-sm">
              /dpp/{"{productId}"}
            </code>
          </span>
          <br />
          Fetches the complete Digital Product Passport for a specific product.
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
          <h4 className="font-semibold mb-1">
            Example Response (Success 200 OK)
          </h4>
          <p className="text-sm mb-1">
            Returns a DPP object based on the{" "}
            <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
              DigitalProductPassport
            </code>{" "}
            type definition.
          </p>
          <details className="border rounded-md">
            <summary className="cursor-pointer p-2 bg-muted hover:bg-muted/80 text-sm">
              <FileJson className="inline h-4 w-4 mr-1 align-middle" />
              Click to view example JSON response for DPP001
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
                401 Unauthorized
              </code>
              : API key missing or invalid.
              <details className="border rounded-md mt-1">
                <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">
                  Example JSON
                </summary>
                <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4">
                  <code>{error401}</code>
                </pre>
              </details>
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-xs">
                404 Not Found
              </code>
              : Product with the given ID does not exist.
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
              : Server-side error.
              <details className="border rounded-md mt-1">
                <summary className="cursor-pointer p-1 bg-muted hover:bg-muted/80 text-xs ml-4">
                  Example JSON
                </summary>
                <pre className="bg-muted/50 p-2 rounded-b-md text-xs overflow-x-auto ml-4">
                  <code>{error500}</code>
                </pre>
              </details>
            </li>
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}
