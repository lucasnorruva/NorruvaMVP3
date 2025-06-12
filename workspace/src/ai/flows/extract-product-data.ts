// 'use server';
/**
 * @fileOverview Extracts and categorizes product information from supplier documents using AI.
 *
 * - extractProductData - A function to extract product data from documents.
 * - ExtractProductDataInput - The input type for the extractProductData function.
 * - ExtractProductDataOutput - The return type for the extractProductData function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { CarbonFootprintData, RecycledContentData, StateOfHealthData } from '@/types/dpp'; // Import specific types


const ExtractProductDataInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A supplier document (invoice, specification, etc.) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  documentType: z
    .string()
    .describe("The type of document being uploaded (e.g., 'invoice', 'specification', 'battery_spec_sheet', 'commercial_invoice', 'packing_list', 'material_safety_data_sheet', 'textile_spec_sheet', 'DoP_document')."),
});
export type ExtractProductDataInput = z.infer<typeof ExtractProductDataInputSchema>;

const CarbonFootprintSchemaForAI = z.object({
  value: z.number().nullable().optional().describe("The carbon footprint value."),
  unit: z.string().optional().describe("Unit of the carbon footprint (e.g., kg CO2e/kWh)."),
  calculationMethod: z.string().optional().describe("Methodology used (e.g., PEFCR, ISO 14067)."),
  vcId: z.string().optional().describe("Verifiable Credential ID for the CF data."),
}).optional();

const RecycledContentSchemaForAI = z.object({
  material: z.string().optional().describe("Specific material (e.g., Cobalt, Lithium)."),
  percentage: z.number().nullable().optional().describe("Percentage of recycled content."),
  vcId: z.string().optional().describe("Verifiable Credential ID for this claim."),
}).optional();

const StateOfHealthSchemaForAI = z.object({
  value: z.number().nullable().optional().describe("State of Health value (e.g., percentage)."),
  unit: z.string().optional().describe("Unit for State of Health (e.g., '%')."),
  measurementDate: z.string().optional().describe("Date of SoH measurement (YYYY-MM-DD)."),
  vcId: z.string().optional().describe("Verifiable Credential ID for SoH data."),
}).optional();

const ScipDataSchemaForAI = z.object({
  articleName: z.string().optional().describe("Name of the article as notified to SCIP."),
  primaryArticleId: z.string().optional().describe("Primary identifier of the article (e.g., EAN, Part Number)."),
  svhcListVersion: z.string().optional().describe("Version of the ECHA Candidate List used for assessment."),
  submittingLegalEntity: z.string().optional().describe("Name or identifier of the legal entity that submitted the notification."),
  safeUseInstructionsLink: z.string().url().optional().describe("Link to safe use instructions, if SVHCs are present."),
}).optional();

const CustomsDataSchemaForAI = z.object({
  hsCode: z.string().optional().describe("Harmonized System (HS) code for customs classification."),
  countryOfOrigin: z.string().optional().describe("ISO 3166-1 alpha-2 code for the country of origin."),
}).optional();

const FiberCompositionEntrySchemaForAI = z.object({
  fiberName: z.string().describe("Name of the textile fiber (e.g., Cotton, Polyester)."),
  percentage: z.number().nullable().optional().describe("Percentage of this fiber in the product."),
});

const TextileInformationSchemaForAI = z.object({
  fiberComposition: z.array(FiberCompositionEntrySchemaForAI).optional().describe("List of fibers and their percentages."),
  countryOfOriginLabeling: z.string().optional().describe("Country of origin for key manufacturing processes as stated on the label."),
  careInstructionsUrl: z.string().url().optional().describe("URL to detailed care instructions."),
  isSecondHand: z.boolean().optional().describe("Indicates if the textile product is second-hand."),
}).optional();

const EssentialCharacteristicSchemaForAI = z.object({
  characteristicName: z.string().describe("Name of the essential characteristic (e.g., Thermal Resistance)."),
  value: z.string().describe("Value of the characteristic."),
  unit: z.string().optional().describe("Unit of measurement for the value."),
  testMethod: z.string().optional().describe("Test method used to determine the value (e.g., EN 12667)."),
});

const ConstructionProductInformationSchemaForAI = z.object({
  declarationOfPerformanceId: z.string().optional().describe("Identifier of the Declaration of Performance (DoP)."),
  ceMarkingDetailsUrl: z.string().url().optional().describe("URL to CE marking information or certificate."),
  intendedUseDescription: z.string().optional().describe("Description of the intended use of the construction product."),
  essentialCharacteristics: z.array(EssentialCharacteristicSchemaForAI).optional().describe("List of essential characteristics and their declared performances."),
}).optional();


const ExtractProductDataOutputSchema = z.object({
  productName: z.string().describe("The name of the product.").optional(),
  productDescription: z.string().describe("A detailed description of the product.").optional(),
  manufacturer: z.string().describe("The manufacturer of the product.").optional(),
  modelNumber: z.string().describe("The model number of the product.").optional(),
  specifications: z.record(z.string(), z.string()).describe("A key-value pair of product specifications.").optional(),
  energyLabel: z.string().describe("The energy label of the product, if available.").optional(),
  
  batteryChemistry: z.string().describe("The chemical composition of the battery (e.g., Li-ion NMC, LFP).").optional(),
  batteryPassportId: z.string().describe("Unique identifier for the battery passport itself.").optional(),
  carbonFootprint: CarbonFootprintSchemaForAI.describe("Carbon footprint details of the battery."),
  recycledContent: z.array(RecycledContentSchemaForAI).optional().describe("Recycled content details for key materials in the battery."),
  stateOfHealth: StateOfHealthSchemaForAI.describe("State of Health details of the battery."),
  batteryRegulationVcId: z.string().describe("Overall Verifiable Credential ID for battery regulation compliance.").optional(),

  scipData: ScipDataSchemaForAI.describe("SCIP database related information if relevant and found.").optional(),
  customsData: CustomsDataSchemaForAI.describe("Basic customs data if relevant and found.").optional(),

  textileInformation: TextileInformationSchemaForAI.describe("Textile-specific product information if relevant and found.").optional(),
  constructionProductInformation: ConstructionProductInformationSchemaForAI.describe("Construction product specific information if relevant and found.").optional(),
});
export type ExtractProductDataOutput = z.infer<typeof ExtractProductDataOutputSchema>;

export async function extractProductData(input: ExtractProductDataInput): Promise<ExtractProductDataOutput> {
  return extractProductDataFlow(input);
}

const extractProductDataPrompt = ai.definePrompt({
  name: 'extractProductDataPrompt',
  input: {schema: ExtractProductDataInputSchema},
  output: {schema: ExtractProductDataOutputSchema},
  prompt: `You are an AI assistant tasked with extracting product information from supplier documents.

You will be provided with a document and its type. Your goal is to extract relevant product information and categorize it into the general fields:
- productName, productDescription, manufacturer, modelNumber, specifications, energyLabel.

Document Type: {{{documentType}}}
Document Content: {{media url=documentDataUri}}

**Prioritization based on Document Type:**

*   **If documentType is 'battery_spec_sheet' or clearly indicates detailed battery information:**
    *   **Strongly prioritize** extracting ALL of the following battery-specific details into the 'batteryRegulation' object:
        *   batteryChemistry: (e.g., Li-ion NMC, LFP)
        *   batteryPassportId: Unique ID for the battery passport.
        *   carbonFootprint: Object with 'value' (number), 'unit', 'calculationMethod', 'vcId' (optional).
        *   recycledContent: Array of objects, each with 'material', 'percentage' (number), 'vcId' (optional). Extract up to 2-3 key materials.
        *   stateOfHealth: Object with 'value' (number), 'unit', 'measurementDate' (YYYY-MM-DD), 'vcId' (optional).
        *   batteryRegulationVcId: Overall Verifiable Credential ID for battery regulation compliance.
    *   Also extract general product information (productName, manufacturer, modelNumber) if present.

*   **If documentType is 'commercial_invoice' or 'packing_list':**
    *   **Prioritize** extracting customs-related data into a 'customsData' object:
        *   hsCode: Harmonized System (HS) code.
        *   countryOfOrigin: ISO 3166-1 alpha-2 code for the country of origin.
    *   Also extract general product information like productName, modelNumber if clearly identifiable.

*   **If documentType is 'material_safety_data_sheet' (MSDS), 'specification_sheet' that clearly discusses chemical composition or substances of concern:**
    *   **Prioritize** extracting SCIP-related data into a 'scipData' object:
        *   articleName: Name of the article containing the SVHC.
        *   primaryArticleId: Identifier for the article (e.g., part number).
        *   svhcListVersion: Version of the ECHA Candidate List used (if mentioned).
        *   submittingLegalEntity: The entity name responsible for submission (if mentioned).
        *   safeUseInstructionsLink: URL for safe use instructions (if provided).
    *   Also extract general product information, especially 'productName' and 'materials' if specified.

*   **If documentType is 'textile_spec_sheet', 'garment_tech_pack', or similar textile-focused document:**
    *   **Prioritize** extracting textile-specific data into a 'textileInformation' object:
        *   fiberComposition: Array of objects, each with 'fiberName' (string) and 'percentage' (number, optional). Extract all listed fibers.
        *   countryOfOriginLabeling: String, e.g., "Made in Portugal (Spinning, Weaving), Assembled in Vietnam (Making-up)".
        *   careInstructionsUrl: String, URL to detailed care instructions.
        *   isSecondHand: Boolean, if the product is second-hand.
    *   Also extract general product information.

*   **If documentType is 'construction_product_dop', 'DoP_document', 'technical_datasheet_construction', or similar construction-focused document:**
    *   **Prioritize** extracting construction product information into a 'constructionProductInformation' object:
        *   declarationOfPerformanceId: String, the DoP identifier.
        *   ceMarkingDetailsUrl: String, URL to CE marking information/certificate.
        *   intendedUseDescription: String, description of the intended use.
        *   essentialCharacteristics: Array of objects, each with 'characteristicName', 'value', 'unit' (optional), 'testMethod' (optional). Extract key characteristics.
    *   Also extract general product information.

*   **For other documentTypes (e.g., 'invoice', 'general_specification', 'bill_of_materials', 'technical_drawing'):**
    *   Extract as much of the general product information as possible: productName, productDescription, manufacturer, modelNumber, specifications, energyLabel.
    *   If battery, SCIP, customs, textile, or construction details are incidentally present and clearly identifiable, extract them into their respective objects.

Extract the product information and return it in JSON format. If a numeric field cannot be found, omit it or return null where appropriate within nested objects. For arrays like 'recycledContent', 'fiberComposition', or 'essentialCharacteristics', if no information is found, return an empty array or omit the field. Only include the 'scipData', 'customsData', 'textileInformation', or 'constructionProductInformation' objects if relevant information is found and prioritized by document type.
`,
});

const extractProductDataFlow = ai.defineFlow(
  {
    name: 'extractProductDataFlow',
    inputSchema: ExtractProductDataInputSchema,
    outputSchema: ExtractProductDataOutputSchema,
  },
  async input => {
    const {output} = await extractProductDataPrompt(input);
    return output!;
  }
);

    