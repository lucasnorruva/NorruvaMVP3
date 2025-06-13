
// --- File: src/app/api/v1/private/dpp/[productId]/confidential-materials/route.ts ---
// Description: Mock API endpoint to retrieve private confidential material details for a product.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateApiKey } from '@/middleware/apiKeyAuth';
import { MOCK_DPPS } from '@/data'; // To check if product ID exists

// Conceptual schema based on openapi.yaml #/components/schemas/ConfidentialMaterialComposition
interface ConfidentialMaterialComposition {
  confidentialMaterialId: string;
  productId: string;
  componentName?: string;
  materialName: string;
  materialDescription?: string;
  composition: Array<{
    substanceName: string;
    casNumber?: string;
    percentageByWeight: string; // Can be a range for IP protection
    role?: string;
    notes?: string;
  }>;
  supplierInformation?: {
    supplierId: string;
    materialBatchId: string;
  };
  accessControlList?: string[];
  lastUpdated: string; // ISO Date string
  version: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  const { productId } = params;

  if (!productId) {
    return NextResponse.json(
      { error: { code: 400, message: 'productId path parameter is required.' } },
      { status: 400 }
    );
  }

  const productExists = MOCK_DPPS.some(dpp => dpp.id === productId);

  if (!productExists) {
    return NextResponse.json(
      { error: { code: 404, message: `Product with ID ${productId} not found, so no confidential materials can be retrieved.` } },
      { status: 404 }
    );
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  let mockConfidentialMaterial: ConfidentialMaterialComposition;

  if (productId === "DPP001") { // Specific mock for EcoSmart Refrigerator
    mockConfidentialMaterial = {
      confidentialMaterialId: `cm_${productId}_refrigerant_blend_X7`,
      productId: productId,
      componentName: "Cooling System Unit",
      materialName: "Proprietary Refrigerant Blend X7-Alpha",
      materialDescription: "High-efficiency, low-GWP refrigerant blend for cooling systems. Composition details are trade secrets.",
      composition: [
        {
          substanceName: "R-XYZ (Trade Secret Component A)",
          casNumber: "CONFIDENTIAL_TS_A",
          percentageByWeight: "60.0 - 65.0 %",
          role: "Primary Refrigerant",
          notes: "Exact chemical identity is a trade secret."
        },
        {
          substanceName: "R-ABC (Trade Secret Component B)",
          casNumber: "CONFIDENTIAL_TS_B",
          percentageByWeight: "30.0 - 35.0 %",
          role: "Secondary Refrigerant / Stabilizer",
        },
        {
          substanceName: "Lubricant Additive Package L-2",
          casNumber: "MIXTURE_PROPRIETARY",
          percentageByWeight: "3.0 - 5.0 %",
          role: "Compressor Lubricant Enhancer"
        },
        {
            substanceName: "Trace SVHC (e.g., Perfluorooctanoic acid - PFOA)",
            casNumber: "335-67-1",
            percentageByWeight: "< 0.001 %",
            role: "Unintentional Trace Contaminant (below reporting threshold)",
            notes: "Monitored, below SCIP notification levels."
        }
      ],
      supplierInformation: {
        supplierId: "SUP_CHEMCORP_001",
        materialBatchId: "REFBLEND_X7A_BATCH_2024_Q3_005"
      },
      accessControlList: [
        "did:example:manufacturer:greentech#internal_rd_cooling_systems",
        "did:example:regulator:epa#secure_submission_refrigerants"
      ],
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
      version: 2
    };
  } else if (productId === "DPP005") { // Specific mock for EV Battery
     mockConfidentialMaterial = {
      confidentialMaterialId: `cm_${productId}_electrolyte_formula_ELEC811`,
      productId: productId,
      componentName: "Battery Cell Electrolyte",
      materialName: "Proprietary Electrolyte Formula ELEC-811",
      materialDescription: "Advanced lithium-ion battery electrolyte with enhanced stability and conductivity.",
      composition: [
        { substanceName: "Lithium Hexafluorophosphate (LiPF6)", casNumber: "21324-40-3", percentageByWeight: "10-15%", role: "Conducting Salt" },
        { substanceName: "Ethylene Carbonate (EC)", casNumber: "96-49-1", percentageByWeight: "25-35%", role: "Solvent" },
        { substanceName: "Dimethyl Carbonate (DMC)", casNumber: "616-38-6", percentageByWeight: "50-60%", role: "Solvent" },
        { substanceName: "Proprietary Additive VC-1A (Trade Secret)", casNumber: "CONFIDENTIAL_TS_VC1A", percentageByWeight: "1-2%", role: "SEI-forming Additive" },
        { substanceName: "Proprietary Additive FEC-2B (Trade Secret)", casNumber: "CONFIDENTIAL_TS_FEC2B", percentageByWeight: "0.5-1%", role: "Flame Retardant Additive" }
      ],
      supplierInformation: { supplierId: "SUP_BATTERYCHEM_007", materialBatchId: "ELEC811_BATCH_202408_001" },
      accessControlList: [
        `did:example:manufacturer:${(MOCK_DPPS.find(d=>d.id===productId)?.manufacturer?.name || "powervolt").toLowerCase().replace(/\s+/g,'')}#battery_rd`,
        `did:example:recycler:specialized_battery_recycling#authorized_eol_processor`
      ],
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
      version: 1
    };
  } else { // Generic fallback
    mockConfidentialMaterial = {
      confidentialMaterialId: `cm_${productId}_generic_mat_001`,
      productId: productId,
      componentName: `Main Component for ${productId}`,
      materialName: `Generic Proprietary Material for ${productId}`,
      composition: [
        { substanceName: "Base Polymer A (Confidential)", casNumber: "CONFIDENTIAL_POLY_A", percentageByWeight: "80-90%", role: "Structural Base" },
        { substanceName: "Additive X (Trade Secret)", casNumber: "CONFIDENTIAL_ADD_X", percentageByWeight: "5-10%", role: "Performance Enhancer" },
        { substanceName: "Colorant Package (Proprietary)", casNumber: "MIXTURE_COLOR_002", percentageByWeight: "1-2%", role: "Coloration" }
      ],
      lastUpdated: new Date().toISOString(),
      version: 1
    };
  }

  return NextResponse.json(mockConfidentialMaterial, { status: 200 });
}
