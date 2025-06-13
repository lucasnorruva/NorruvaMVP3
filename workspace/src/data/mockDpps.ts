
import type { DigitalProductPassport, EbsiVerificationDetails, BatteryRegulationDetails, ScipNotificationDetails, EuCustomsDataDetails, TextileInformation, ConstructionProductInformation, OwnershipNftLink, DocumentReference, LifecycleEvent } from '@/types/dpp'; // Added OwnershipNftLink, DocumentReference, LifecycleEvent

export const MOCK_DPPS: DigitalProductPassport[] = [
  {
    id: "DPP001",
    productName: "EcoSmart Refrigerator X500",
    category: "Appliances",
    manufacturer: { name: "GreenTech Appliances", did: "did:ebsi:zyxts12345", eori: "DE123456789" },
    modelNumber: "X500-ECO",
    sku: "SKU-X500",
    nfcTagId: "NFC123456",
    rfidTagId: "RFID654321",
    metadata: {
      created_at: "2024-01-01T10:00:00Z",
      last_updated: "2024-07-30T10:00:00Z",
      status: "published",
      dppStandardVersion: "CIRPASS v0.9 Draft",
      onChainStatus: "Active", 
      onChainLifecycleStage: "InUse", 
    },
    authenticationVcId: "vc_auth_DPP001_mock123", 
    ownershipNftLink: { 
        registryUrl: "https://mock-nft-market.example/token/0xNFTContractForDPP001/1",
        contractAddress: "0xNFTContractForDPP001",
        tokenId: "1",
        chainName: "MockEthereum",
    },
    productDetails: {
      description: "The EcoSmart Refrigerator X500 is a flagship product from GreenTech Appliances, meticulously designed for households that prioritize both cutting-edge technology and environmental responsibility. This spacious 400-liter unit boasts an A++ energy rating, significantly reducing electricity consumption compared to conventional models. Its construction heavily features recycled steel (70% by weight), contributing to circular economy goals. The refrigerator employs an advanced AI-driven FrostFree system, which not only prevents ice build-up but also optimizes cooling cycles for maximum efficiency and food preservation. Key components like the compressor are engineered for a 15-year lifespan, backed by extensive durability testing. Smart connectivity allows users to monitor and control energy usage remotely, further enhancing its eco-friendly profile. GreenTech Appliances provides comprehensive transparency through this Digital Product Passport, detailing its manufacturing processes, material origins, and end-of-life recyclability (rated at 95%).",
      energyLabel: "A++",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "refrigerator kitchen",
      materials: [
        {name: "Recycled Steel (Frame & Door)", percentage: 70, isRecycled: true, origin: "Germany", recycledContentPercentage: 70},
        {name: "Polyurethane (Insulation)", percentage: 15, origin: "Belgium"},
        {name: "Tempered Glass (Shelves)", percentage: 5, origin: "Poland"},
        {name: "ABS Plastic (Interior)", percentage: 5, recycledContentPercentage: 20, isRecycled: true, origin: "Netherlands"},
        {name: "Copper (Piping)", percentage: 2, origin: "Chile"},
        {name: "Refrigerant R600a", percentage: 0.1, origin: "Germany"},
      ],
      sustainabilityClaims: [
        { claim: "A++ Energy Efficiency Rating", verificationDetails: "EU Energy Label Certified" },
        { claim: "Constructed with 70% recycled steel content", verificationDetails: "Supplier Declaration & Material Traceability Report #MTR789" },
        { claim: "Designed for 95% recyclability at end-of-life", verificationDetails: "Internal Assessment based on EN 45555" },
        { claim: "Low Global Warming Potential (GWP) refrigerant R600a used", verificationDetails: "F-Gas Regulation Compliant" },
        { claim: "15-year designed lifespan for critical components", evidenceVcId: "vc:durability:greentech:dpp001", verificationDetails: "Internal Durability Test Protocol DTP-005" }
      ],
      specifications: JSON.stringify({ "Capacity (Liters)": "400", "Annual Energy Consumption (kWh)": "150", "Noise Level (dB)": "38", "Dimensions (HxWxD cm)": "180x70x65", "Color": "Stainless Steel", "Refrigerant Type": "R600a", "Defrost Type": "FrostFree AI" }, null, 2),
      customAttributes: [
        {key: "Eco Rating", value: "Gold Star (Self-Assessed)"},
        {key: "Special Feature", value: "AI Defrost Technology, Smart Home Integration"},
        {key: "Warranty Period", value: "5 Years Full, 10 Years Compressor"},
        {key: "Country of Origin", value: "Germany"},
        {key: "Manufacturing Plant ID", value: "GT-PLANT-001-STG"}
      ],
      repairabilityScore: { value: 8.5, scale: 10, reportUrl: "https://greentech.com/repair/X500-ECO-report.pdf", vcId: "vc:repair:greentech:dpp001" },
      sparePartsAvailability: "7 years from date of purchase for all parts, 10 years for compressor and cooling system components.",
      repairManualUrl: "https://greentech.com/manuals/X500-ECO-repair.pdf",
      disassemblyInstructionsUrl: "https://greentech.com/manuals/X500-ECO-disassembly.pdf",
      recyclabilityInformation: { instructionsUrl: "https://greentech.com/recycling/X500-ECO", recycledContentPercentage: 95, designForRecycling: true, vcId: "vc:recycle:greentech:dpp001"},
    },
    compliance: {
      eprel: { id: "EPREL_REG_12345", status: "Registered", url: "#eprel-link", lastChecked: "2024-01-18T00:00:00Z" },
      esprConformity: { status: "conformant", assessmentId: "ESPR_ASSESS_001", assessmentDate: "2024-01-01" },
      battery_regulation: { status: "not_applicable" },
      scipNotification: { 
        status: 'Notified', 
        notificationId: 'SCIP-REF-DPP001-1A2B',
        svhcListVersion: '2024/01 (24.0.1)',
        submittingLegalEntity: 'GreenTech Appliances GmbH',
        articleName: 'Refrigerator Control Panel Assembly X500',
        primaryArticleId: 'X500-CTRL-ASSY',
        safeUseInstructionsLink: 'https://greentech.com/sds/X500-CTRL-ASSY-SUI.pdf',
        lastChecked: "2024-07-29T00:00:00Z" 
      },
      euCustomsData: { 
        status: 'Verified', 
        declarationId: 'CUST_DECL_XYZ789', 
        hsCode: "84181020", 
        countryOfOrigin: "DE",
        netWeightKg: 75.5,
        grossWeightKg: 80.2,
        customsValuation: { value: 450.00, currency: "EUR" },
        lastChecked: "2024-07-28T00:00:00Z" 
      },
    },
    ebsiVerification: {
      status: "verified",
      verificationId: "EBSI_TX_ABC123",
      issuerDid: "did:ebsi:zIssuerXYZ789", 
      schema: "EBSIProductComplianceSchema_v1.2", 
      issuanceDate: "2024-07-24T10:00:00Z", 
      lastChecked: "2024-07-25T00:00:00Z"
    } as EbsiVerificationDetails,
    blockchainIdentifiers: { 
      platform: "MockChain", 
      anchorTransactionHash: "0x123abc456def789ghi012jkl345mno678pqr901stu234vwx567yz890abcdef", 
      contractAddress: "0xMOCK_CONTRACT_FOR_DPP001", 
      tokenId: "MOCK_TOKENID_FOR_DPP001_mock1"
    },
    consumerScans: 1250,
    lifecycleEvents: [
      { id: "evt_dpp001_mfg", type: "Manufacturing Complete", timestamp: "2024-01-15T08:00:00Z", location: "GreenTech Plant A, Stuttgart", responsibleParty: "GreenTech Appliances", data: { batchId: "BATCH_X500_20240115_A", qualityControlRef: "QC_X500_A_001" }, transactionHash: "0xmock_mfg_tx_dpp001", vcId: "vc:mfg:dpp001:01" },
      { id: "evt_dpp001_qa", type: "Quality Assurance Passed", timestamp: "2024-01-16T10:00:00Z", location: "GreenTech Plant A, Stuttgart", responsibleParty: "QA Department", data: { reportId: "QA_RPT_X500_A_001", standardsMet: ["ISO 9001", "CE LVD"] } },
      { id: "evt_dpp001_ship", type: "Shipped to Distributor", timestamp: "2024-01-20T14:00:00Z", location: "DHL Hub, Frankfurt", responsibleParty: "DHL Logistics", data: { trackingNumber: "DHLTRACK12345", destinationHub: "Paris Logistics Center" }, transactionHash: "0xmock_ship_tx_dpp001" },
      { id: "evt_dpp001_retail", type: "First Retail Sale", timestamp: "2024-02-10T16:30:00Z", location: "Paris Central Store", responsibleParty: "EcoMart Paris", data: { customerSegment: "Eco-Conscious Urban" } },
      { id: "evt_dpp001_repair", type: "Repair Conducted", timestamp: "2024-06-05T10:00:00Z", location: "Authorized Service Center, Paris", responsibleParty: "RepairTech Solutions", data: { repairDetails: "Replaced faulty temperature sensor. Part No: TS-X500-03. Warranty Claim: WARR-98765", replacedParts: ["TS-X500-03"], newPartsSN: ["TS-X500-03-SN123"] } },
      { id: "evt_dpp001_service", type: "Scheduled Maintenance Due", timestamp: "2025-02-15T00:00:00Z", location: "Customer Location", responsibleParty: "Customer/Service Partner", data: { serviceType: "Filter Replacement", recommendedInterval: "12 months" } },
      { id: "evt_dpp001_eol", type: "Projected End-of-Life", timestamp: "2039-01-15T00:00:00Z", data: { expectedRecyclability: "95%", primaryRecyclableMaterials: ["Steel", "Copper", "Plastics (PP, ABS)"] } }
    ],
    certifications: [
      {id: "cert1", name: "Energy Star v6.0", issuer: "EPA", issueDate: "2024-01-01T11:00:00Z", documentUrl: "#", transactionHash: "0xcertAnchor1", standard: "Energy Star Program Requirements for Refrigerators v6.0", vcId: "vc:energystar:dpp001"},
      {id: "cert2", name: "ISO 14001:2015", issuer: "TUV Rheinland", issueDate: "2024-01-20T00:00:00Z", expiryDate: "2026-11-14", documentUrl: "#iso14001", vcId: "vc:iso:14001:greentech:dpp001", standard: "ISO 14001:2015", transactionHash: "0xcertAnchorISO14001"},
      {id: "cert_rohs_dpp001", name: "RoHS Compliance Certificate", issuer: "Intertek", issueDate: "2024-01-05T00:00:00Z", documentUrl: "#rohs_dpp001", standard: "Directive 2011/65/EU", vcId: "vc:rohs:intertek:dpp001" },
      {id: "cert_weee_dpp001", name: "WEEE Declaration of Conformity", issuer: "GreenTech Appliances", issueDate: "2024-01-05T00:00:00Z", documentUrl: "#weee_doc_dpp001", standard: "Directive 2012/19/EU"},
    ],
    verifiableCredentials: [
        {
            id: "urn:uuid:cred-energy-star-dpp001",
            type: ["VerifiableCredential", "EnergyStarCertification"],
            name: "Energy Star Certificate VC",
            issuer: "did:ebsi:zEnergyStarIssuer",
            issuanceDate: "2024-01-01T11:00:00Z",
            credentialSubject: {
                productId: "DPP001",
                certificationStandard: "Energy Star Program Requirements for Refrigerators v6.0",
                certificationStatus: "Active"
            }
        },
        {
            id: "urn:uuid:cred-iso14001-dpp001",
            type: ["VerifiableCredential", "ISOComplianceCredential"],
            name: "ISO 14001 Compliance VC",
            issuer: "did:ebsi:zTuvRheinland",
            issuanceDate: "2024-01-20T00:00:00Z",
            credentialSubject: {
                productId: "DPP001", 
                standard: "ISO 14001:2015",
                complianceStatus: "Conformant",
                expiryDate: "2026-11-14"
            }
        }
    ],
    documents: [
      { name: "User Manual v1.2", url: "#manual_v1.2.pdf", type: "User Manual", addedTimestamp: "2024-01-15T00:00:00Z" },
      { name: "Warranty Card", url: "#warranty.pdf", type: "Warranty", addedTimestamp: "2024-01-15T00:00:00Z" },
      { name: "Declaration of Conformity (EU)", url: "#doc_eu_dpp001.pdf", type: "Declaration of Conformity", addedTimestamp: "2024-01-10T00:00:00Z" },
      { name: "Recycling Instructions", url: "#recycling_dpp001.pdf", type: "End-of-Life Information", addedTimestamp: "2024-01-15T00:00:00Z" },
    ] as DocumentReference[],
    traceability: {
    originCountry: "DE",
      supplyChainSteps: [
        {
          stepName: 'Manufactured',
          actorDid: 'did:example:greentech',
          timestamp: '2024-01-15T00:00:00Z',
          location: 'Factory A, Stuttgart, Germany',
          transactionHash: '0xstep1'
        },
        {
          stepName: 'Quality Control Passed',
          actorDid: 'did:example:greentech_qc',
          timestamp: '2024-01-16T10:00:00Z',
          location: 'Factory A, Stuttgart, Germany',
        },
        {
          stepName: 'Shipped to Central Warehouse',
          actorDid: 'did:example:dhl_logistics',
          timestamp: '2024-01-20T14:00:00Z',
          location: 'DHL Hub, Frankfurt, Germany',
          transactionHash: '0xmock_ship_tx_dpp001'
        }
      ]
    },
    supplyChainLinks: [
      { supplierId: "SUP001", suppliedItem: "Compressor Unit XJ-500", notes: "Primary compressor supplier for EU market. Audited for ethical sourcing." },
      { supplierId: "SUP002", suppliedItem: "Recycled Steel Panels (70%)", notes: "Certified post-consumer recycled content." }
    ]
  },
  {
    id: "DPP002",
    productName: "Sustainable Cotton T-Shirt",
    category: "Apparel",
    manufacturer: { name: "EcoThreads", eori: "FR987654321"},
    modelNumber: "ET-TS-ORG-M",
    metadata: { 
      last_updated: "2024-07-25T14:30:00Z", 
      status: "draft", 
      created_at: "2024-03-01T10:00:00Z",
      onChainStatus: "Pending Activation", 
      onChainLifecycleStage: "Manufacturing", 
    },
    authenticationVcId: "vc_auth_DPP002_mock456", 
    productDetails: {
      description: "A sustainable t-shirt made from 100% GOTS certified organic cotton.",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "cotton t-shirt apparel",
      materials: [{name: "Organic Cotton", percentage: 100, isRecycled: false, origin: "India"}],
      specifications: JSON.stringify({ "Fit": "Regular", "GSM": "180", "Origin": "India", "Care": "Machine wash cold" }, null, 2),
      customAttributes: [{key: "Certifications", value: "GOTS, Fair Trade"}, {key: "Care Instructions", value: "Machine wash cold, tumble dry low"}],
    },
    textileInformation: {
      fiberComposition: [
        { fiberName: "Organic Cotton", percentage: 95 },
        { fiberName: "Elastane", percentage: 5 }
      ],
      countryOfOriginLabeling: "India (Spinning, Weaving), Portugal (Making-up)",
      careInstructionsUrl: "https://ecothreads.com/care/ET-TS-ORG-M",
      isSecondHand: false,
    },
    compliance: {
      eprel: { status: "Not Applicable", lastChecked: "2024-07-25T00:00:00Z" },
      eu_espr: { status: "pending" },
      battery_regulation: { status: "not_applicable" },
      scipNotification: { 
        status: 'Pending Notification', 
        svhcListVersion: '2024/01 (24.0.1)',
        submittingLegalEntity: 'EcoThreads S.A.',
        articleName: 'Dyed Organic Cotton Fabric',
        primaryArticleId: 'FAB-ORG-CTN-01',
        lastChecked: "2024-07-25T00:00:00Z" 
      }, 
      euCustomsData: { 
        status: 'Pending Documents', 
        hsCode: "61091000", // HS Code for cotton t-shirts
        countryOfOrigin: "IN",
        netWeightKg: 0.15,
        grossWeightKg: 0.2,
        customsValuation: { value: 8.50, currency: "USD" },
        lastChecked: "2024-07-25T00:00:00Z" 
      },
    },
    ebsiVerification: { status: "pending_verification", lastChecked: "2024-07-20T00:00:00Z"} as EbsiVerificationDetails,
    consumerScans: 300,
    blockchainIdentifiers: { 
      platform: "MockChain", 
      contractAddress: "0xSomeOtherContract", 
      tokenId: "TOKEN_TSHIRT_002" 
    }, 
    certifications: [
      {id: "cert3", name: "GOTS", issuer: "Control Union", issueDate: "2024-02-20", expiryDate: "2025-02-19", documentUrl: "#gots", standard: "Global Organic Textile Standard 6.0"},
    ],
    verifiableCredentials: [
      {
          id: "urn:uuid:cred-gots-dpp002",
          type: ["VerifiableCredential", "GOTSCertification"],
          name: "GOTS Certificate VC",
          issuer: "did:ebsi:zControlUnion",
          issuanceDate: "2024-02-20T00:00:00Z",
          credentialSubject: {
              productId: "DPP002",
              standard: "Global Organic Textile Standard 6.0",
              certificationStatus: "Active",
              scope: "Organic Cotton T-Shirt"
          }
      }
    ],
    documents: [],
    traceability: {
    originCountry: "IN",
      supplyChainSteps: [
        {
          stepName: 'Manufactured',
          actorDid: 'did:example:ecothreads',
          timestamp: '2024-03-05T00:00:00Z',
          location: 'Factory B',
          transactionHash: '0xstep2'
        }
      ]
    },
    supplyChainLinks: [
       { supplierId: "SUP003", suppliedItem: "Organic Cotton Yarn", notes: "GOTS Certified Supplier for all global production." }
    ]
  },
  {
    id: "DPP003",
    productName: "Recycled Polymer Phone Case",
    category: "Accessories",
    manufacturer: { name: "ReCase It", eori: "NL112233445"},
    modelNumber: "RC-POLY-IP15",
    metadata: { 
      last_updated: "2024-07-22T09:15:00Z", 
      status: "flagged", 
      created_at: "2024-04-10T10:00:00Z",
      onChainStatus: "FlaggedForReview", 
      onChainLifecycleStage: "InUse" 
    },
    compliance: {
      eprel: { status: "Not Applicable", lastChecked: "2024-07-22T00:00:00Z" },
      eu_espr: { status: "compliant" },
      us_scope3: { status: "compliant" },
      battery_regulation: { status: "not_applicable" },
      scipNotification: { 
        status: 'Notified', 
        notificationId: 'SCIP-REF-DPP003-C3D4',
        svhcListVersion: '2023/06 (23.1.0)',
        submittingLegalEntity: 'ReCase It B.V.',
        articleName: 'Phone Case Housing (Recycled Polymer)',
        primaryArticleId: 'RC-POLY-IP15-HOUSING',
        safeUseInstructionsLink: 'https://recaseit.com/sui/RC-POLY-IP15.pdf',
        lastChecked: "2024-07-21T00:00:00Z" 
      },
      euCustomsData: { 
        status: 'Cleared', 
        declarationId: 'CUST_IMP_DEF456', 
        hsCode: "39269097", 
        countryOfOrigin: "CN",
        netWeightKg: 0.05,
        grossWeightKg: 0.08,
        customsValuation: { value: 3.50, currency: "EUR" },
        lastChecked: "2024-07-20T00:00:00Z" 
      },
    },
    consumerScans: 2100,
     productDetails: { description: "A recycled phone case."},
     blockchainIdentifiers: { platform: "OtherChain", anchorTransactionHash: "0x789polymerAnchorHash000333", contractAddress: "0xContractForDPP003", tokenId: "NFT003"},
    documents: [],
    traceability: {
      originCountry: "CN",
      supplyChainSteps: [
        {
          stepName: 'Manufactured',
          actorDid: 'did:example:recaseit',
          timestamp: '2024-04-15T00:00:00Z',
          location: 'Factory C',
          transactionHash: '0xstep3'
        }
      ]
    },
    supplyChainLinks: [],
    ebsiVerification: { status: "not_verified", lastChecked: "2024-07-23T00:00:00Z"} as EbsiVerificationDetails,
  },
  {
    id: "DPP004",
    productName: "Modular Sofa System",
    category: "Furniture",
    manufacturer: { name: "Comfy Living"},
    modelNumber: "CL-MODSOFA-01",
    metadata: { 
      last_updated: "2024-07-20T11:00:00Z", 
      status: "archived", 
      created_at: "2023-12-01T10:00:00Z",
      onChainStatus: "Archived", 
      onChainLifecycleStage: "EndOfLife" 
    },
    compliance: {
      eprel: { status: "Not Applicable", lastChecked: "2024-07-20T00:00:00Z" },
      eu_espr: { status: "compliant" },
      battery_regulation: { status: "not_applicable" },
      scipNotification: { status: 'Pending Notification', svhcListVersion: '2024/01 (24.0.1)', submittingLegalEntity: 'Comfy Living Designs', articleName: 'Sofa Frame Connector', primaryArticleId: 'CL-MODSOFA-CONN01', lastChecked: "2024-07-19T00:00:00Z" },
      euCustomsData: { 
        status: 'Verified', 
        declarationId: 'CUST_SOFA_777', 
        hsCode: "94016100", 
        countryOfOrigin: "PL",
        netWeightKg: 45.0,
        grossWeightKg: 50.0,
        customsValuation: { value: 350.00, currency: "EUR" },
        lastChecked: "2024-07-18T00:00:00Z" 
      }
    },
    consumerScans: 850,
    productDetails: { description: "A modular sofa."},
    documents: [],
    traceability: {
      originCountry: "SE",
      supplyChainSteps: [
        {
          stepName: 'Manufactured',
          actorDid: 'did:example:comfyliving',
          timestamp: '2023-12-10T00:00:00Z',
          location: 'Factory D',
          transactionHash: '0xstep4'
        }
      ]
    },
    supplyChainLinks: [],
    ebsiVerification: { status: "error", lastChecked: "2024-07-19T00:00:00Z", message: "Connection timeout to EBSI node."} as EbsiVerificationDetails,
  },
  {
    id: "DPP005",
    productName: "High-Performance EV Battery",
    category: "Automotive Parts",
    manufacturer: { name: "PowerVolt", eori: "US567890123"},
    modelNumber: "PV-EVB-75KWH",
    metadata: { 
      last_updated: "2024-07-29T08:00:00Z", 
      status: "pending_review", 
      created_at: "2024-05-01T10:00:00Z",
      onChainStatus: "Active",
      onChainLifecycleStage: "QualityAssurance",
    },
    productDetails: {
      description: "A high-performance EV battery module designed for long range and fast charging. Contains NMC 811 chemistry for optimal energy density.",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "ev battery module electric car",
      materials: [
        { name: "Nickel", percentage: 60, origin: "Various", isRecycled: true, recycledContentPercentage: 15 },
        { name: "Manganese", percentage: 10, origin: "Various" },
        { name: "Cobalt", percentage: 10, origin: "Various", isRecycled: true, recycledContentPercentage: 10 },
        { name: "Lithium", percentage: 5, origin: "Australia", isRecycled: true, recycledContentPercentage: 5 },
        { name: "Graphite (Anode)", percentage: 10, origin: "China" },
        { name: "Aluminum (Casing)", percentage: 5, origin: "Various", isRecycled: true, recycledContentPercentage: 50 },
      ],
      specifications: JSON.stringify({ "Capacity (kWh)": "75", "Nominal Voltage (V)": "400", "Weight (kg)": "450", "Chemistry": "NMC 811", "Cycle Life (80% DoD)": "3000" }, null, 2),
      customAttributes: [
        {key: "Charging Time (0-80%)", value: "30 minutes (DC Fast Charge @ 150kW)"},
        {key: "Energy Density (Wh/kg)", value: "167"},
        {key: "Thermal Management", value: "Liquid Cooled"}
      ]
    },
    compliance: {
      eprel: { status: "Not Applicable", lastChecked: "2024-07-28T00:00:00Z" }, 
      battery_regulation: {
        status: "pending",
        batteryChemistry: "NMC 811",
        batteryPassportId: "BATT-ID-PV-EVB-75KWH-SN001",
        carbonFootprint: { value: 85.5, unit: "kg CO2e/kWh", calculationMethod: "PEFCR for Batteries v1.2", vcId: "vc:cf:dpp005" },
        recycledContent: [
          { material: "Cobalt", percentage: 12, vcId: "vc:rc:cobalt:dpp005" },
          { material: "Lithium", percentage: 4, vcId: "vc:rc:lithium:dpp005" },
          { material: "Nickel", percentage: 10, vcId: "vc:rc:nickel:dpp005" }
        ],
        stateOfHealth: {value: 100, unit: '%', measurementDate: "2024-07-15T00:00:00Z", vcId: "vc:soh:dpp005"},
        vcId: "vc:battreg:overall:dpp005"
      } as BatteryRegulationDetails,
      eu_espr: { status: "pending" }, 
      scipNotification: { 
        status: 'Pending Notification', 
        svhcListVersion: '2024/01 (24.0.1)',
        submittingLegalEntity: 'PowerVolt Inc.',
        articleName: 'EV Battery Module Assembly',
        primaryArticleId: 'PV-EVB-75KWH-ASSY',
        safeUseInstructionsLink: 'https://powervolt.com/sds/PV-EVB-75KWH-SUI.pdf',
        lastChecked: "2024-07-27T00:00:00Z" 
      },
      euCustomsData: { 
        status: 'Pending Documents', 
        hsCode: "85076000", // HS code for lithium-ion batteries
        countryOfOrigin: "US",
        netWeightKg: 450.0,
        grossWeightKg: 465.0,
        customsValuation: { value: 8500.00, currency: "USD" },
        lastChecked: "2024-07-29T00:00:00Z" 
      },
    },
    ebsiVerification: { status: "pending_verification", lastChecked: "2024-07-29T00:00:00Z"} as EbsiVerificationDetails,
    consumerScans: 50,
    certifications: [
      {id: "cert_bat_01", name: "UN 38.3 Transport Test", issuer: "TestCert Ltd.", issueDate: "2024-07-01", documentUrl: "#", transactionHash: "0xcertAnchorBat1", standard: "UN Manual of Tests and Criteria, Part III, subsection 38.3"},
      {id: "cert_bat_02", name: "ISO 26262 (ASIL D)", issuer: "AutomotiveSafetyCert", issueDate: "2024-06-15", documentUrl: "#", standard: "ISO 26262-Road vehicles Functional safety", vcId: "vc:iso26262:dpp005"}
    ],
    documents: [
        { name: "Battery Safety Data Sheet (SDS)", url: "#sds_pv_evb_75kwh.pdf", type: "Safety Data Sheet", addedTimestamp: "2024-05-10T00:00:00Z" },
        { name: "Technical Specification Sheet", url: "#techspec_pv_evb_75kwh.pdf", type: "Technical Specification", addedTimestamp: "2024-05-10T00:00:00Z" },
    ],
    traceability: {
      originCountry: "US",
      supplyChainSteps: [
        {
          stepName: 'Cell Manufacturing',
          actorDid: 'did:example:cellmaker',
          timestamp: '2024-05-10T00:00:00Z',
          location: 'Nevada, US',
          transactionHash: '0xcellmfg_tx_hash'
        },
        {
          stepName: 'Module Assembly',
          actorDid: 'did:example:powervolt',
          timestamp: '2024-06-01T00:00:00Z',
          location: 'Michigan, US',
          transactionHash: '0xmoduleassy_tx_hash'
        }
      ]
    },
    blockchainIdentifiers: { 
      platform: "PowerChain Ledger", 
      anchorTransactionHash: "0xevBatteryAnchorHash555AAA", 
      contractAddress: "0xEV_BATTERY_REGISTRY", 
      tokenId: "TOKEN_PV_EVB_75KWH_SN001"
    },
    supplyChainLinks: []
  },
  { 
    id: "DPP006",
    productName: "EcoSmart Insulation Panel R50",
    category: "Construction Materials",
    manufacturer: { name: "BuildGreen Systems", eori: "BE0123456789" },
    modelNumber: "ESP-R50-1200",
    metadata: {
      created_at: "2024-07-01T00:00:00Z",
      last_updated: "2024-08-01T10:00:00Z",
      status: "published",
      dppStandardVersion: "CPR EN 13163",
      onChainStatus: "Active",
      onChainLifecycleStage: "InUse",
    },
    productDetails: {
      description: "High-performance, sustainable insulation panel made from recycled cellulose fibers and a bio-based binder. Provides excellent thermal resistance (R-value 50).",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "insulation panel construction",
      materials: [
        { name: "Recycled Cellulose Fiber", percentage: 85, isRecycled: true },
        { name: "Bio-based Binder", percentage: 10 },
        { name: "Fire Retardant (Non-halogenated)", percentage: 5 }
      ],
      specifications: JSON.stringify({ "Thermal Resistance (R-value)": "50", "Thickness (mm)": "150", "Density (kg/m^3)": "35", "Fire Rating": "Euroclass B-s1, d0" }, null, 2),
      customAttributes: [
        {key: "Recycled Content Source", value: "Post-consumer paper"},
        {key: "VOC Emissions", value: "Low (A+)"}
      ]
    },
    constructionProductInformation: {
      declarationOfPerformanceId: "DoP_ESP-R50-1200_001",
      ceMarkingDetailsUrl: "https://buildgreen.com/certs/ce_esp-r50.pdf",
      intendedUseDescription: "Thermal insulation for building envelopes (walls, roofs, floors).",
      essentialCharacteristics: [
        { characteristicName: "Thermal Conductivity (λ)", value: "0.030 W/(m·K)", testMethod: "EN 12667" },
        { characteristicName: "Reaction to Fire", value: "B-s1, d0", testMethod: "EN 13501-1" },
        { characteristicName: "Water Vapour Diffusion Resistance (µ)", value: "3", testMethod: "EN 12086" }
      ]
    },
    compliance: {
      eprel: { status: "Not Applicable", lastChecked: "2024-08-01T00:00:00Z" },
      battery_regulation: { status: "not_applicable" },
      scipNotification: { 
        status: 'Not Required', 
        lastChecked: "2024-08-01T00:00:00Z", 
        svhcListVersion: "N/A",
        articleName: "Insulation Panel (Cellulose Based)",
        primaryArticleId: "ESP-R50-1200-PANEL"
      },
      esprConformity: { status: "conformant", assessmentId: "CPR_ASSESS_006", assessmentDate: "2024-07-15" },
      euCustomsData: {
        status: "Verified",
        declarationId: "CUST_CPR_DPP006",
        hsCode: "68061000", 
        countryOfOrigin: "BE",
        netWeightKg: 5.5,
        grossWeightKg: 6.0,
        customsValuation: { value: 25.00, currency: "EUR" },
        lastChecked: "2024-07-20T00:00:00Z"
      }
    },
    ebsiVerification: { status: "pending_verification", lastChecked: "2024-08-01T00:00:00Z"} as EbsiVerificationDetails,
    traceability: { originCountry: "BE" },
    consumerScans: 15,
    certifications: [
      {id: "cert_cpr_01", name: "CE Marking (CPR)", issuer: "Notified Body 0123 (BE)", issueDate: "2024-07-15", documentUrl: "https://buildgreen.com/certs/ce_esp-r50.pdf", standard: "EN 13163"},
      {id: "cert_epd_01", name: "Environmental Product Declaration", issuer: "EPD Program Operator XYZ", issueDate: "2024-07-20", documentUrl: "https://buildgreen.com/epd/esp-r50.pdf", standard: "ISO 14025", vcId: "vc:epd:buildgreen:dpp006"}
    ],
  }
];

    
    
    


```

The following tabs on the Product Detail page have been enhanced for better visual representation and comprehensiveness:
*   **Sustainability Tab**: Now uses distinct cards for Key Claims, Materials & Circularity, Energy Efficiency, and Repairability & End-of-Life. It employs a `DetailItem` sub-component for consistent metric display.
*   **Compliance Tab & Header**: The `ProductComplianceHeader` now displays a more prominent overall status badge. The `ComplianceTab` itself uses `ComplianceDetailItemDisplay` to render each checkpoint with clear status, icons, and actions like EPREL sync.
*   **History Tab**: The timeline visualization has been refined with specific icons for different action types (e.g., `PlusCircle` for Created, `Layers` for Lifecycle, `Award` for Certification) and improved display of event details including tooltips for longer descriptions.
*   **Supply Chain Tab**: Supplier links are now individual cards, providing a cleaner look. The "View Private Attestations" feature has a loading state and displays attestations in an accordion if successful, or an error message.
*   **Mock Data (`MOCK_DPPS`)**: The entry for `DPP001` has been significantly enriched across various sections (sustainability details, compliance fields like SCIP/Customs/Battery, lifecycle events, documents, supply chain links) to ensure these new tab designs have ample data to display.

These changes should make the product detail page much more informative and visually appealing.

**Task 2 Evaluation:**

*   **Completeness:** The key compliance-related display components (`ComplianceTab`, `ProductComplianceHeader`, `ComplianceDetailItemDisplay`) have been enhanced. Mock data for `DPP001` has been updated to ensure these compliance sections have data to display.
*   **Readiness for Task 3:** Yes, Task 3 (Add AI suggestions for "Battery Regulation Details" in the `ProductForm`) is ready. The product detail page (display side) is now more robust. Improving the data entry side with AI assistance is a logical next step.

---

**Task 3: Add specific AI suggestions for "Battery Regulation Details" within `ProductForm.tsx` (via `BatteryDetailsFormSection.tsx`).**

*   **Objective:** When a user is on the Battery Details accordion in the product creation/editing form, allow them to click a button to get AI suggestions for fields like battery chemistry, capacity, carbon footprint values, recycled content, and state of health, based on the product's name and category.
*   **Plan:**
    1.  **Modify `src/components/products/form/BatteryDetailsFormSection.tsx`:**
        *   Add a "Suggest Battery Details with AI" button.
        *   Implement a handler function (`callSuggestBatteryDetailsAIInternal` or similar) that:
            *   Retrieves `productName` and `productCategory` from the form.
            *   Calls the existing `suggestBatteryDetails` AI flow from `src/ai/flows/suggest-battery-details-flow.ts`.
            *   Uses a `toast` to inform the user if more input (name/category) is needed.
            *   On successful AI response:
                *   Populates the relevant form fields within the `batteryRegulation` object (e.g., `batteryRegulation.batteryChemistry`, `batteryRegulation.carbonFootprint.value`, `batteryRegulation.stateOfHealth.value`, etc.).
                *   For `recycledContent` (which is an array), it might suggest a few common materials or an overall percentage. This will likely append new entries to the `useFieldArray` for recycled content.
                *   Updates the corresponding `batteryRegulationOrigin` fields to `'AI_EXTRACTED'`.
                *   Shows a success toast.
            *   Handles errors with a toast.
        *   Ensure the "Suggest..." button has a loading state.
    2.  **Modify `src/utils/aiFormHelpers.tsx`:**
        *   Create a new exported async function, `handleSuggestBatteryDetailsAI`, similar to the other helpers. This function will encapsulate the logic to call `suggestBatteryDetails` flow and handle loading/toast messages.
    3.  **Update `src/ai/flows/suggest-battery-details-flow.ts`:**
        *   Ensure the `SuggestBatteryDetailsOutputSchema` and the prompt are comprehensive enough to suggest values for all key fields in `BatteryRegulationDetails` (chemistry, passport ID, CF value/unit/method, recycled content materials/percentages, SoH value/unit/date, overall VC ID).
        *   The AI prompt should be guided to provide realistic, common values based on product category/name. For example, if the category is "EV", it might suggest "Li-ion NMC" chemistry and a higher carbon footprint than for a "Power Tool".

I will now generate the changes for Task 3.
<changes>
  <description>Integrated AI suggestions for Battery Regulation Details in the Product Form. This includes a "Suggest Battery Details" button in `BatteryDetailsFormSection.tsx`, a new helper function in `aiFormHelpers.tsx`, and an updated AI flow/prompt in `suggest-battery-details-flow.ts` to provide comprehensive suggestions for battery-related fields.</description>
  <change>
    <file>/workspace/src/components/products/form/BatteryDetailsFormSection.tsx</file>
    <content><![CDATA[
// --- File: BatteryDetailsFormSection.tsx ---
// Description: Form section component for battery-specific details in the product form.
"use client";

import React, { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AiIndicator from "./AiIndicator";
import type { ProductFormData } from "@/components/products/ProductForm";
import type { InitialProductFormData } from "@/app/(app)/products/new/page";
import type { SuggestBatteryDetailsOutput } from "@/ai/flows/suggest-battery-details-flow";
import { handleSuggestBatteryDetailsAI } from "@/utils/aiFormHelpers"; // Import the new helper
import type { ToastInput } from "@/hooks/use-toast";
import { Sparkles, Loader2, AlertTriangle, PlusCircle, Trash2 } from "lucide-react";
import type { BatteryRegulationDetails, CarbonFootprintData, StateOfHealthData, RecycledContentData } from "@/types/dpp";

type ToastFn = (input: ToastInput) => void;

interface BatteryDetailsFormSectionProps {
  form: UseFormReturn<ProductFormData>;
  initialData?: Partial<InitialProductFormData>;
  isSubmittingForm?: boolean;
  toast: ToastFn;
}

export default function BatteryDetailsFormSection({ form, initialData, isSubmittingForm, toast }: BatteryDetailsFormSectionProps) {
  const [isSuggestingBatteryDetailsInternal, setIsSuggestingBatteryDetailsInternal] = useState(false);

  const { fields: recycledContentFields, append: appendRecycledContent, remove: removeRecycledContent } = useFieldArray({
    control: form.control,
    name: "batteryRegulation.recycledContent",
  });

  const callSuggestBatteryDetailsAIInternal = async () => {
    const result = await handleSuggestBatteryDetailsAI(form, toast, setIsSuggestingBatteryDetailsInternal);
    if (result) {
      let suggestionsMade = false;
      const originPath = "batteryRegulationOrigin";

      if (result.suggestedBatteryChemistry) {
        form.setValue("batteryRegulation.batteryChemistry", result.suggestedBatteryChemistry, { shouldValidate: true });
        form.setValue(`${originPath}.batteryChemistryOrigin` as any, 'AI_EXTRACTED');
        suggestionsMade = true;
      }
      if (result.suggestedBatteryPassportId) {
        form.setValue("batteryRegulation.batteryPassportId", result.suggestedBatteryPassportId, { shouldValidate: true });
        form.setValue(`${originPath}.batteryPassportIdOrigin` as any, 'AI_EXTRACTED');
        suggestionsMade = true;
      }
      if (result.suggestedBatteryRegulationVcId) {
        form.setValue("batteryRegulation.vcId", result.suggestedBatteryRegulationVcId, { shouldValidate: true });
        form.setValue(`${originPath}.vcIdOrigin` as any, 'AI_EXTRACTED');
        suggestionsMade = true;
      }

      if (result.suggestedCarbonFootprint) {
        if (result.suggestedCarbonFootprint.value !== undefined) {
          form.setValue("batteryRegulation.carbonFootprint.value", result.suggestedCarbonFootprint.value, { shouldValidate: true });
          form.setValue(`${originPath}.carbonFootprintOrigin.valueOrigin` as any, 'AI_EXTRACTED');
          suggestionsMade = true;
        }
        if (result.suggestedCarbonFootprint.unit) {
          form.setValue("batteryRegulation.carbonFootprint.unit", result.suggestedCarbonFootprint.unit, { shouldValidate: true });
          form.setValue(`${originPath}.carbonFootprintOrigin.unitOrigin` as any, 'AI_EXTRACTED');
          suggestionsMade = true;
        }
        if (result.suggestedCarbonFootprint.calculationMethod) {
          form.setValue("batteryRegulation.carbonFootprint.calculationMethod", result.suggestedCarbonFootprint.calculationMethod, { shouldValidate: true });
          form.setValue(`${originPath}.carbonFootprintOrigin.calculationMethodOrigin` as any, 'AI_EXTRACTED');
          suggestionsMade = true;
        }
      }

      if (result.suggestedStateOfHealth) {
        if (result.suggestedStateOfHealth.value !== undefined) {
          form.setValue("batteryRegulation.stateOfHealth.value", result.suggestedStateOfHealth.value, { shouldValidate: true });
          form.setValue(`${originPath}.stateOfHealthOrigin.valueOrigin` as any, 'AI_EXTRACTED');
          suggestionsMade = true;
        }
        if (result.suggestedStateOfHealth.unit) {
          form.setValue("batteryRegulation.stateOfHealth.unit", result.suggestedStateOfHealth.unit, { shouldValidate: true });
          form.setValue(`${originPath}.stateOfHealthOrigin.unitOrigin` as any, 'AI_EXTRACTED');
          suggestionsMade = true;
        }
        if (result.suggestedStateOfHealth.measurementDate) {
          form.setValue("batteryRegulation.stateOfHealth.measurementDate", result.suggestedStateOfHealth.measurementDate, { shouldValidate: true });
          form.setValue(`${originPath}.stateOfHealthOrigin.measurementDateOrigin` as any, 'AI_EXTRACTED');
          suggestionsMade = true;
        }
      }
      
      if (result.suggestedRecycledContent && result.suggestedRecycledContent.length > 0) {
        // Clear existing AI suggested recycled content before appending new ones to avoid duplicates from multiple suggestions
        // Or, more robustly, merge based on material if AI might suggest updates to existing ones.
        // For now, simple append:
        const currentRecycledContentLength = form.getValues("batteryRegulation.recycledContent")?.length || 0;
        result.suggestedRecycledContent.forEach((rc, index) => {
          if (rc.material && rc.percentage !== undefined) {
            appendRecycledContent({ material: rc.material, percentage: rc.percentage, vcId: "" });
            const newIndex = currentRecycledContentLength + index;
            form.setValue(`${originPath}.recycledContentOrigin.${newIndex}.materialOrigin` as any, 'AI_EXTRACTED');
            form.setValue(`${originPath}.recycledContentOrigin.${newIndex}.percentageOrigin` as any, 'AI_EXTRACTED');
            suggestionsMade = true;
          }
        });
      }
      
      if (!suggestionsMade) {
         toast({ title: "No Specific Battery Details Suggested", description: "AI could not find specific battery details to suggest based on current product info. You can still fill them manually.", variant: "default" });
      }
    }
  };


  return (
    <div className="space-y-6 pt-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Provide detailed battery information as per EU Battery Regulation. Fields are optional.</p>
        <Button type="button" variant="ghost" size="sm" onClick={callSuggestBatteryDetailsAIInternal} disabled={isSuggestingBatteryDetailsInternal || !!isSubmittingForm}>
            {isSuggestingBatteryDetailsInternal ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-info" />}
            <span className="ml-2">{isSuggestingBatteryDetailsInternal ? "Suggesting..." : "Suggest Battery Details"}</span>
        </Button>
      </div>

      <FormField
        control={form.control}
        name="batteryRegulation.batteryChemistry"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Battery Chemistry
              <AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.batteryChemistryOrigin} fieldName="Battery Chemistry" />
            </FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Li-ion NMC, LFP"
                {...field}
                onChange={(e) => { field.onChange(e); form.setValue("batteryRegulationOrigin.batteryChemistryOrigin" as any, "manual"); }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="batteryRegulation.batteryPassportId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">Battery Passport ID (Optional)
              <AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.batteryPassportIdOrigin} fieldName="Battery Passport ID" />
            </FormLabel>
            <FormControl><Input placeholder="Unique ID for the battery passport itself" {...field} onChange={(e) => { field.onChange(e); form.setValue("batteryRegulationOrigin.batteryPassportIdOrigin" as any, "manual"); }} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="batteryRegulation.vcId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">Overall Battery Regulation VC ID (Optional)
              <AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.vcIdOrigin} fieldName="Overall Battery VC ID" />
            </FormLabel>
            <FormControl><Input placeholder="Verifiable Credential ID for overall compliance" {...field} onChange={(e) => { field.onChange(e); form.setValue("batteryRegulationOrigin.vcIdOrigin" as any, "manual"); }} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Carbon Footprint Section */}
      <div className="p-4 border rounded-md space-y-3 bg-muted/30">
        <h4 className="font-medium text-md text-primary">Manufacturing Carbon Footprint</h4>
        <FormField control={form.control} name="batteryRegulation.carbonFootprint.value"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">Value
                <AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.carbonFootprintOrigin?.valueOrigin} fieldName="CF Value" />
              </FormLabel>
              <FormControl><Input type="number" placeholder="e.g., 85.5" {...field} onChange={e => { field.onChange(e.target.value === '' ? null : e.target.valueAsNumber); form.setValue("batteryRegulationOrigin.carbonFootprintOrigin.valueOrigin" as any, "manual"); }} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="batteryRegulation.carbonFootprint.unit"
          render={({ field }) => (
            <FormItem><FormLabel className="flex items-center">Unit<AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.carbonFootprintOrigin?.unitOrigin} fieldName="CF Unit" /></FormLabel>
            <FormControl><Input placeholder="e.g., kg CO2e/kWh" {...field} onChange={(e) => { field.onChange(e); form.setValue("batteryRegulationOrigin.carbonFootprintOrigin.unitOrigin" as any, "manual"); }} /></FormControl><FormMessage /></FormItem>
          )} />
        <FormField control={form.control} name="batteryRegulation.carbonFootprint.calculationMethod"
          render={({ field }) => (
            <FormItem><FormLabel className="flex items-center">Calculation Method<AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.carbonFootprintOrigin?.calculationMethodOrigin} fieldName="CF Method" /></FormLabel>
            <FormControl><Input placeholder="e.g., PEFCR for Batteries v1.2" {...field} onChange={(e) => { field.onChange(e); form.setValue("batteryRegulationOrigin.carbonFootprintOrigin.calculationMethodOrigin" as any, "manual"); }} /></FormControl><FormMessage /></FormItem>
          )} />
        <FormField control={form.control} name="batteryRegulation.carbonFootprint.vcId"
          render={({ field }) => (
            <FormItem><FormLabel>Carbon Footprint VC ID (Optional)</FormLabel><FormControl><Input placeholder="VC ID for carbon footprint data" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
      </div>

      {/* State of Health Section */}
      <div className="p-4 border rounded-md space-y-3 bg-muted/30">
        <h4 className="font-medium text-md text-primary">State of Health (SoH)</h4>
        <FormField control={form.control} name="batteryRegulation.stateOfHealth.value"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">Value
                <AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.stateOfHealthOrigin?.valueOrigin} fieldName="SoH Value" />
              </FormLabel>
              <FormControl><Input type="number" placeholder="e.g., 100 (for new)" {...field} onChange={e => { field.onChange(e.target.value === '' ? null : e.target.valueAsNumber); form.setValue("batteryRegulationOrigin.stateOfHealthOrigin.valueOrigin" as any, "manual"); }} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="batteryRegulation.stateOfHealth.unit"
          render={({ field }) => (
            <FormItem><FormLabel className="flex items-center">Unit<AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.stateOfHealthOrigin?.unitOrigin} fieldName="SoH Unit" /></FormLabel>
            <FormControl><Input placeholder="e.g., %" {...field} onChange={(e) => { field.onChange(e); form.setValue("batteryRegulationOrigin.stateOfHealthOrigin.unitOrigin" as any, "manual"); }} /></FormControl><FormMessage /></FormItem>
          )} />
        <FormField control={form.control} name="batteryRegulation.stateOfHealth.measurementDate"
          render={({ field }) => (
            <FormItem><FormLabel className="flex items-center">Measurement Date<AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.stateOfHealthOrigin?.measurementDateOrigin} fieldName="SoH Date" /></FormLabel>
            <FormControl><Input type="date" {...field} onChange={(e) => { field.onChange(e); form.setValue("batteryRegulationOrigin.stateOfHealthOrigin.measurementDateOrigin" as any, "manual"); }} /></FormControl><FormMessage /></FormItem>
          )} />
        <FormField control={form.control} name="batteryRegulation.stateOfHealth.vcId"
          render={({ field }) => (
            <FormItem><FormLabel>State of Health VC ID (Optional)</FormLabel><FormControl><Input placeholder="VC ID for SoH data" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
      </div>

      {/* Recycled Content Section */}
      <div className="p-4 border rounded-md space-y-3 bg-muted/30">
        <h4 className="font-medium text-md text-primary">Recycled Content in Active Materials</h4>
        {recycledContentFields.map((item, index) => (
          <div key={item.id} className="p-3 border rounded-md bg-background space-y-2 relative">
            <FormField control={form.control} name={`batteryRegulation.recycledContent.${index}.material`}
              render={({ field }) => (
                <FormItem><FormLabel className="flex items-center">Material
                  <AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.recycledContentOrigin?.[index]?.materialOrigin} fieldName={`Material #${index + 1}`} />
                </FormLabel><FormControl><Input placeholder="e.g., Cobalt, Lithium, Nickel, Lead" {...field} onChange={(e) => { field.onChange(e); form.setValue(`batteryRegulationOrigin.recycledContentOrigin.${index}.materialOrigin` as any, "manual"); }} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name={`batteryRegulation.recycledContent.${index}.percentage`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">Percentage (%)
                    <AiIndicator fieldOrigin={initialData?.batteryRegulationOrigin?.recycledContentOrigin?.[index]?.percentageOrigin} fieldName={`Recycled Content % #${index + 1}`} />
                  </FormLabel>
                  <FormControl><Input type="number" placeholder="e.g., 16" {...field} onChange={e => { field.onChange(e.target.value === '' ? null : e.target.valueAsNumber); form.setValue(`batteryRegulationOrigin.recycledContentOrigin.${index}.percentageOrigin` as any, "manual"); }} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            <FormField control={form.control} name={`batteryRegulation.recycledContent.${index}.vcId`}
              render={({ field }) => (
                <FormItem><FormLabel>VC ID for this material (Optional)</FormLabel><FormControl><Input placeholder="VC ID for specific recycled material claim" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 text-destructive" onClick={() => removeRecycledContent(index)} title="Remove this material">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => appendRecycledContent({ material: "", percentage: null, vcId: "" })}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Material for Recycled Content
        </Button>
      </div>

    </div>
  );
}

    