
// --- File: useDPPLiveData.ts ---
// Description: Custom hook to manage data fetching, state, filtering, sorting, and actions for the DPP Live Dashboard.
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { DigitalProductPassport, DashboardFiltersState, SortConfig, SortableKeys, DisplayableProduct } from '@/types/dpp';
import { MOCK_DPPS } from '@/data';
import { getSortValue } from '@/utils/sortUtils';
import { calculateDppCompletenessForList, getOverallComplianceDetails } from '@/utils/dppDisplayUtils';
import { useToast } from '@/hooks/use-toast';
import { useRole, type UserRole } from '@/contexts/RoleContext';

const USER_PRODUCTS_LOCAL_STORAGE_KEY = 'norruvaUserProducts';

export interface ProcessedDPP extends DigitalProductPassport {
  completeness: { score: number; filledFields: number; totalFields: number; missingFields: string[] };
  overallCompliance: ReturnType<typeof getOverallComplianceDetails>;
}

const defaultFiltersBase: DashboardFiltersState = {
  status: "all",
  regulation: "all",
  category: "all",
  searchQuery: "",
  blockchainAnchored: "all",
  manufacturer: "all",
  completeness: "all",
  onChainStatus: "all",
  isTextileProduct: undefined,
  isConstructionProduct: undefined,
};


export function useDPPLiveData() {
  const router = useRouter();
  const { toast } = useToast();
  const { currentRole } = useRole();

  const [dpps, setDpps] = useState<DigitalProductPassport[]>([]);
  const [filters, setFilters] = useState<DashboardFiltersState>(defaultFiltersBase);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'id', direction: 'ascending' });
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
    const userAddedProducts: DigitalProductPassport[] = storedProductsString ? JSON.parse(storedProductsString) : [];
    
    const combinedProducts = [
      ...MOCK_DPPS.filter(mockDpp => !userAddedProducts.find(userDpp => userDpp.id === mockDpp.id)),
      ...userAddedProducts
    ];
    setDpps(combinedProducts);
  }, []);

  useEffect(() => {
    let roleSpecificDefaults: Partial<DashboardFiltersState> = {};

    switch (currentRole) {
      case 'admin':
        // Admin sees all by default.
        roleSpecificDefaults = { ...defaultFiltersBase, status: "all" };
        break;
      case 'manufacturer':
        // Manufacturers might want to see all their products, regardless of status.
        roleSpecificDefaults = { ...defaultFiltersBase, status: "all" };
        // In a real app, we might add: manufacturer: "current_manufacturer_id_or_name"
        break;
      case 'verifier':
        // Verifiers focus on pending_review and flagged products primarily.
        roleSpecificDefaults = { ...defaultFiltersBase, status: "pending_review" };
        break;
      case 'retailer':
        // Retailers primarily care about published products.
        roleSpecificDefaults = { ...defaultFiltersBase, status: "published" };
        break;
      case 'recycler':
        // Recyclers might look at archived or published (nearing EOL).
        roleSpecificDefaults = { ...defaultFiltersBase, status: "archived" };
        break;
      case 'supplier':
        // Suppliers might be interested in products their components are in,
        // usually published ones.
        roleSpecificDefaults = { ...defaultFiltersBase, status: "published" };
        break;
      default:
        roleSpecificDefaults = { ...defaultFiltersBase, status: "published" };
        break;
    }
    // Preserve existing search query, reset other filters to role-specific defaults
    setFilters(prevFilters => ({
      ...defaultFiltersBase, // Reset all to absolute base defaults
      ...roleSpecificDefaults, // Apply new role-specific defaults
      searchQuery: prevFilters.searchQuery || "", // Preserve search or default to empty
    }));
  }, [currentRole]);


  const availableCategories = useMemo(() => {
    const categories = new Set(dpps.map(dpp => dpp.category));
    return Array.from(categories).sort();
  }, [dpps]);

  const availableManufacturers = useMemo(() => {
    const manufacturers = new Set(dpps.map(dpp => dpp.manufacturer?.name).filter(Boolean) as string[]);
    return ["all", ...Array.from(manufacturers).sort()];
  }, [dpps]);

  const processedDPPs = useMemo(() => {
    return dpps.map(dpp => ({
      ...dpp,
      completeness: calculateDppCompletenessForList(dpp as DisplayableProduct),
      overallCompliance: getOverallComplianceDetails(dpp),
    }));
  }, [dpps]);

  const sortedAndFilteredDPPs: ProcessedDPP[] = useMemo(() => {
    let tempProducts = [...processedDPPs]; 

    // Client-side filtering for all criteria
    tempProducts = tempProducts.filter((dpp) => {
      // Search Query (productName, id, gtin, manufacturer.name)
      if (filters.searchQuery) {
        const lowerSearch = filters.searchQuery.toLowerCase();
        if (
          !dpp.productName.toLowerCase().includes(lowerSearch) &&
          !dpp.id.toLowerCase().includes(lowerSearch) &&
          !(dpp.gtin && dpp.gtin.toLowerCase().includes(lowerSearch)) &&
          !(dpp.manufacturer?.name && dpp.manufacturer.name.toLowerCase().includes(lowerSearch))
        ) return false;
      }
      
      // Status Filter
      if (filters.status !== "all") {
        if (filters.status === "archived") { // "archived" UI filter now means metadata.isArchived
          if (!dpp.metadata.isArchived) return false;
        } else {
          // For any other specific status, ensure it's NOT archived AND matches the status
          if (dpp.metadata.isArchived || dpp.metadata.status !== filters.status) return false;
        }
      } else {
        // If status is "all", we still need to respect if the user *doesn't* want to see archived items
        // This is now handled by the API call (includeArchived=false by default)
        // But for client-side, if we fetched all, we might need to filter out archived if an "includeArchived" UI toggle existed
        // For now, if filters.status is "all", we show non-archived + archived if includeArchived was true.
        // The API's default is includeArchived=false. Let's assume if filters.status is "all", the API was called with includeArchived=true
        // So, no further client-side filtering based on isArchived is needed for "all" status here.
      }
      
      // Regulation Filter (conceptual, checks if ANY compliance status is "compliant" for the selected regulation)
      if (filters.regulation !== "all") {
        const complianceData = dpp.compliance[filters.regulation as keyof typeof dpp.compliance];
        if (!complianceData || (typeof complianceData === 'object' && 'status' in complianceData && (complianceData.status as string).toLowerCase() !== 'compliant')) return false;
      }

      // Category Filter
      if (filters.category !== "all" && dpp.category !== filters.category) return false;
      
      // Blockchain Anchored Filter
      if (filters.blockchainAnchored === 'anchored' && !dpp.blockchainIdentifiers?.anchorTransactionHash) return false;
      if (filters.blockchainAnchored === 'not_anchored' && dpp.blockchainIdentifiers?.anchorTransactionHash) return false;
      
      // Manufacturer Filter
      if (filters.manufacturer !== "all" && dpp.manufacturer?.name !== filters.manufacturer) return false;
      
      // On-Chain Status Filter
      if (filters.onChainStatus && filters.onChainStatus !== "all" && dpp.metadata.onChainStatus !== filters.onChainStatus) return false;

      // Data Completeness Filter
      if (filters.completeness !== "all") {
        const score = dpp.completeness.score;
        if (filters.completeness === '>75' && score <= 75) return false;
        if (filters.completeness === '50-75' && (score < 50 || score > 75)) return false;
        if (filters.completeness === '<50' && score >= 50) return false;
      }

      // Textile Product Filter
      if (filters.isTextileProduct === true && !dpp.textileInformation) return false;
      if (filters.isTextileProduct === false && dpp.textileInformation) return false;

      // Construction Product Filter
      if (filters.isConstructionProduct === true && !dpp.constructionProductInformation) return false;
      if (filters.isConstructionProduct === false && dpp.constructionProductInformation) return false;

      return true;
    });

    if (sortConfig.key && sortConfig.direction) {
      tempProducts.sort((a, b) => {
        let valA: any;
        let valB: any;

        if (sortConfig.key === 'completenessScore') {
            valA = a.completeness.score;
            valB = b.completeness.score;
        } else if (sortConfig.key === 'manufacturer.name') {
            valA = a.manufacturer?.name;
            valB = b.manufacturer?.name;
        } else if (sortConfig.key === 'overallCompliance') { 
            valA = a.overallCompliance.text;
            valB = b.overallCompliance.text;
        } else {
            valA = getSortValue(a, sortConfig.key!);
            valB = getSortValue(b, sortConfig.key!);
        }

        if (typeof valA === 'string' && typeof valB === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        const valAExists = valA !== undefined && valA !== null && valA !== '';
        const valBExists = valB !== undefined && valB !== null && valB !== '';

        if (!valAExists && valBExists) return sortConfig.direction === 'ascending' ? 1 : -1;
        if (valAExists && !valBExists) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (!valAExists && !valBExists) return 0;

        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return tempProducts;
  }, [processedDPPs, filters, sortConfig]);

  const metrics = useMemo(() => {
    const sourceForMetrics = sortedAndFilteredDPPs; 
    const totalDPPs = sourceForMetrics.length;
    
    const fullyCompliantDPPsCount = sourceForMetrics.filter(dpp => 
        dpp.overallCompliance.text.toLowerCase().includes('compliant')
    ).length;

    const compliantPercentage = totalDPPs > 0 
      ? ((fullyCompliantDPPsCount / totalDPPs) * 100).toFixed(1) + "%" 
      : "0%";
    const pendingReviewDPPs = sourceForMetrics.filter(d => d.metadata.status === 'pending_review' && !d.metadata.isArchived).length; 
    const totalConsumerScans = sourceForMetrics.reduce((sum, dpp) => sum + (dpp.consumerScans || 0), 0);
    const averageConsumerScans = totalDPPs > 0 ? (totalConsumerScans / totalDPPs).toFixed(1) : "0";
    const averageCompleteness = totalDPPs > 0 
      ? (sourceForMetrics.reduce((sum, p) => sum + p.completeness.score, 0) / totalDPPs).toFixed(1) + "%" 
      : "0%";

    return { totalDPPs, compliantPercentage, pendingReviewDPPs, totalConsumerScans, averageConsumerScans, averageCompleteness };
  }, [sortedAndFilteredDPPs]); 

  const categoryDistribution = useMemo(() => {
    const sourceForChart = sortedAndFilteredDPPs; 
    const counts: Record<string, number> = {};
    sourceForChart.forEach(dpp => {
      counts[dpp.category] = (counts[dpp.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [sortedAndFilteredDPPs]); 

  const complianceDistribution = useMemo(() => {
    const sourceForChart = sortedAndFilteredDPPs; 
    const counts: Record<string, number> = {};
    sourceForChart.forEach(dpp => {
      const statusText = dpp.overallCompliance.text;
      counts[statusText] = (counts[statusText] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [sortedAndFilteredDPPs]); 


  const handleFiltersChange = useCallback((newFilters: Partial<DashboardFiltersState>) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  }, []);

  const handleSort = useCallback((key: SortableKeys) => {
    setSortConfig(prevConfig => {
      const direction: 'ascending' | 'descending' = 
        prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending';
      return { key, direction };
    });
  }, []);

  const handleDeleteRequest = useCallback((productId: string) => {
    setProductToDeleteId(productId);
    setIsDeleteDialogOpen(true);
  }, []);

  const confirmDeleteProduct = useCallback(() => {
    if (!productToDeleteId) return;
    const productIsUserAdded = productToDeleteId.startsWith("USER_PROD");
    
    setDpps(prevDpps => 
      prevDpps.map(p => 
        p.id === productToDeleteId 
          ? { ...p, metadata: { ...p.metadata, isArchived: true, last_updated: new Date().toISOString() } } 
          : p
      )
    );

    if (productIsUserAdded) {
      const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
      let userProducts: DigitalProductPassport[] = storedProductsString ? JSON.parse(storedProductsString) : [];
      const productIndex = userProducts.findIndex(p => p.id === productToDeleteId);
      if (productIndex > -1) {
        userProducts[productIndex].metadata.isArchived = true;
        userProducts[productIndex].metadata.last_updated = new Date().toISOString();
        localStorage.setItem(USER_PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(userProducts));
      }
    }
    
    const productName = dpps.find(p=>p.id === productToDeleteId)?.productName || productToDeleteId;
    toast({ title: "Product Archived", description: `Product "${productName}" has been archived (soft deleted).` });
    setIsDeleteDialogOpen(false);
    setProductToDeleteId(null);
  }, [productToDeleteId, toast, dpps]);

  return {
    dpps: processedDPPs, 
    filters,
    sortConfig,
    productToDeleteId,
    isDeleteDialogOpen,
    availableCategories,
    availableManufacturers, 
    sortedAndFilteredDPPs,
    metrics,
    categoryDistribution, 
    complianceDistribution, 
    handleFiltersChange,
    handleSort,
    handleDeleteRequest,
    confirmDeleteProduct,
    setIsDeleteDialogOpen,
    router, 
    toast   
  };
}

