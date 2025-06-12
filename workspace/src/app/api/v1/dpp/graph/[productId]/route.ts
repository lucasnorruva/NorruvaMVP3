
// --- File: src/app/api/v1/dpp/graph/[productId]/route.ts ---
// Description: Conceptual API endpoint to retrieve graph data for a DPP.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateApiKey } from '@/middleware/apiKeyAuth';
import { MOCK_DPPS, MOCK_SUPPLIERS } from '@/data';
import type { DigitalProductPassport, Supplier } from '@/types/dpp';

interface GraphNode {
  id: string;
  label: string;
  type: 'product' | 'manufacturer' | 'supplier' | 'lifecycle_event' | 'component';
  data?: Record<string, any>;
}

interface GraphEdge {
  id: string;
  source: string; // Node ID
  target: string; // Node ID
  label: string; // Relationship type
  data?: Record<string, any>;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;
  const auth = validateApiKey(request);
  if (auth) return auth;

  const product = MOCK_DPPS.find(dpp => dpp.id === productId);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 180));

  if (!product) {
    return NextResponse.json({ error: { code: 404, message: `Product with ID ${productId} not found.` } }, { status: 404 });
  }

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // Product Node
  nodes.push({
    id: product.id,
    label: product.productName,
    type: 'product',
    data: { category: product.category, modelNumber: product.modelNumber, gtin: product.gtin }
  });

  // Manufacturer Node & Edge
  if (product.manufacturer?.name) {
    const manufacturerId = `mfg_${product.manufacturer.name.replace(/\s+/g, '_').toLowerCase()}`;
    if (!nodes.find(n => n.id === manufacturerId)) {
      nodes.push({
        id: manufacturerId,
        label: product.manufacturer.name,
        type: 'manufacturer',
        data: { did: product.manufacturer.did, address: product.manufacturer.address, eori: product.manufacturer.eori }
      });
    }
    edges.push({
      id: `edge_mfg_${manufacturerId}_prod_${product.id}`,
      source: manufacturerId,
      target: product.id,
      label: 'manufactured_by'
    });
  }

  // Suppliers Nodes & Edges
  if (product.supplyChainLinks && product.supplyChainLinks.length > 0) {
    product.supplyChainLinks.forEach((link, index) => {
      const supplier = MOCK_SUPPLIERS.find(s => s.id === link.supplierId);
      const supplierNodeId = `sup_${link.supplierId}`;
      
      if (supplier && !nodes.find(n => n.id === supplierNodeId)) {
        nodes.push({
          id: supplierNodeId,
          label: supplier.name,
          type: 'supplier',
          data: { location: supplier.location, materialsSupplied: supplier.materialsSupplied, contact: supplier.contactPerson }
        });
      }

      // Component Node (derived from suppliedItem)
      const componentIdSuffix = link.suppliedItem.replace(/\s+/g, '_').toLowerCase();
      const componentNodeId = `comp_${product.id}_${componentIdSuffix}_${index}`;
      if (!nodes.find(n => n.id === componentNodeId)) {
          nodes.push({
            id: componentNodeId,
            label: link.suppliedItem,
            type: 'component',
            data: { notes: link.notes }
          });
      }
      
      // Edge: Supplier -> Component
      if (supplier) {
        edges.push({
          id: `edge_sup_${supplierNodeId}_comp_${componentNodeId}`,
          source: supplierNodeId,
          target: componentNodeId,
          label: 'supplies_item'
        });
      }
      
      // Edge: Component -> Product
      edges.push({
        id: `edge_comp_${componentNodeId}_prod_${product.id}`,
        source: componentNodeId,
        target: product.id,
        label: 'is_part_of'
      });
    });
  }

  // Lifecycle Events Nodes & Edges (max 3 for brevity in graph)
  if (product.lifecycleEvents && product.lifecycleEvents.length > 0) {
    product.lifecycleEvents.slice(0, 3).forEach(event => { 
      const eventNodeId = `event_${product.id}_${event.id}`;
      if (!nodes.find(n => n.id === eventNodeId)) {
        nodes.push({
          id: eventNodeId,
          label: event.type,
          type: 'lifecycle_event',
          data: { timestamp: event.timestamp, location: event.location, responsibleParty: event.responsibleParty, eventData: event.data }
        });
      }
      edges.push({
        id: `edge_prod_${product.id}_event_${event.id}`,
        source: product.id,
        target: eventNodeId,
        label: 'underwent_event'
      });
    });
  }

  const graphData: GraphData = { nodes, edges };

  return NextResponse.json(graphData);
}
