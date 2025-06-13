
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

  const [allRawDpps, setAllRawDpps] = useState<DigitalProductPassport[]>([]);
  const [allProcessedDpps, setAllProcessedDpps] = useState<ProcessedDPP[]>([]);
  const [roleScopedProcessedDpps, setRoleScopedProcessedDpps] = useState<ProcessedDPP[]>([]);
  
  const [filters, setFilters] = useState<DashboardFiltersState>(() => ({
    ...defaultFiltersBase, 
    searchQuery: "" 
  }));
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'id', direction: 'ascending' });
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Effect 1: Load and process all DPPs once on initial mount
  useEffect(() => {
    const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
    const userAddedProducts: DigitalProductPassport[] = storedProductsString ? JSON.parse(storedProductsString) : [];
    
    const combinedRawProducts = [
      ...MOCK_DPPS.filter(mockDpp => !userAddedProducts.find(userDpp => userDpp.id === mockDpp.id)),
      ...userAddedProducts
    ];
    setAllRawDpps(combinedRawProducts);

    const processed = combinedRawProducts.map(dpp => ({
      ...dpp,
      completeness: calculateDppCompletenessForList(dpp as DisplayableProduct),
      overallCompliance: getOverallComplianceDetails(dpp),
    }));
    setAllProcessedDpps(processed);
  }, []);

  // Effect 2: Determine role-scoped data and reset filters when role or allProcessedDpps change
  useEffect(() => {
    if (!allProcessedDpps.length) {
        setRoleScopedProcessedDpps([]);
        return;
    }

    let newScopedDpps = [...allProcessedDpps];
    let roleDefaults: Partial<DashboardFiltersState> = { ...defaultFiltersBase }; // Start with global defaults
    
    // Preserve search query across role changes
    const currentSearchQuery = filters.searchQuery;

    switch (currentRole) {
      case 'admin':
        newScopedDpps = allProcessedDpps.filter(dpp => !dpp.metadata.isArchived);
        roleDefaults = { ...defaultFiltersBase, status: "all" };
        break;
      case 'manufacturer':
        newScopedDpps = allProcessedDpps.filter(dpp =>
          !dpp.metadata.isArchived && (dpp.metadata.status === 'draft' || dpp.metadata.status === 'published' || dpp.metadata.status === 'pending_review')
        );
        roleDefaults = { ...defaultFiltersBase, status: "all"}; 
        break;
      case 'verifier':
        newScopedDpps = allProcessedDpps.filter(dpp =>
          !dpp.metadata.isArchived && (dpp.metadata.status === 'pending_review' || dpp.metadata.status === 'flagged')
        );
        roleDefaults = { ...defaultFiltersBase, status: "pending_review"}; 
        break;
      case 'retailer':
        newScopedDpps = allProcessedDpps.filter(dpp =>
          !dpp.metadata.isArchived && dpp.metadata.status === 'published'
        );
        roleDefaults = { ...defaultFiltersBase, status: "published"};
        break;
      case 'recycler':
        newScopedDpps = allProcessedDpps.filter(dpp =>
          (dpp.metadata.status === 'published' && !dpp.metadata.isArchived) || dpp.metadata.isArchived === true
        );
        roleDefaults = { ...defaultFiltersBase, status: "all" }; 
        break;
      case 'supplier':
        newScopedDpps = allProcessedDpps.filter(dpp =>
          !dpp.metadata.isArchived && dpp.metadata.status === 'published'
        );
        roleDefaults = { ...defaultFiltersBase, status: "published"};
        break;
      default:
        newScopedDpps = allProcessedDpps.filter(dpp => !dpp.metadata.isArchived && dpp.metadata.status === 'published');
        roleDefaults = { ...defaultFiltersBase, status: "published"};
        break;
    }
    setRoleScopedProcessedDpps(newScopedDpps);
    // When role changes, reset filters to the new role's defaults, but keep any existing search query
    setFilters(prevFilters => ({ ...defaultFiltersBase, ...roleDefaults, searchQuery: prevFilters.searchQuery }));

  }, [currentRole, allProcessedDpps]); // Removed filters.searchQuery from here to avoid loops, it's handled by applying it below

  const availableCategories = useMemo(() => {
    const categories = new Set(allRawDpps.map(dpp => dpp.category)); // Use allRawDpps for complete list
    return Array.from(categories).sort();
  }, [allRawDpps]);

  const availableManufacturers = useMemo(() => {
    const manufacturers = new Set(allRawDpps.map(dpp => dpp.manufacturer?.name).filter(Boolean) as string[]);
    return ["all", ...Array.from(manufacturers).sort()];
  }, [allRawDpps]);

  const sortedAndFilteredDPPs: ProcessedDPP[] = useMemo(() => {
    let tempProducts = [...roleScopedProcessedDpps]; 

    if (filters.searchQuery) {
      const lowerSearch = filters.searchQuery.toLowerCase();
      tempProducts = tempProducts.filter(dpp =>
        dpp.productName.toLowerCase().includes(lowerSearch) ||
        dpp.id.toLowerCase().includes(lowerSearch) ||
        (dpp.gtin && dpp.gtin.toLowerCase().includes(lowerSearch)) ||
        (dpp.manufacturer?.name && dpp.manufacturer.name.toLowerCase().includes(lowerSearch))
      );
    }
    
    if (filters.status !== "all") {
      if (filters.status === "archived") {
        // When 'archived' status is selected, we want ONLY items where isArchived is true.
        // roleScopedProcessedDpps for Recycler already includes archived. For others, it doesn't.
        // This ensures correct display for Recycler and potentially others if they choose 'archived'.
        tempProducts = tempProducts.filter(dpp => dpp.metadata.isArchived === true);
      } else {
        // For any other specific status, ensure it's not an archived product being shown.
        tempProducts = tempProducts.filter(dpp => dpp.metadata.status === filters.status && !dpp.metadata.isArchived);
      }
    } else {
        // If 'all' status is selected, we *still* generally respect the isArchived flag,
        // unless the role (like Recycler) explicitly includes them in its roleScopedProcessedDpps.
        // This means if roleScopedProcessedDpps contains archived items (e.g. for Recycler), they will pass this.
        // If roleScopedProcessedDpps does NOT contain archived items (e.g. for Admin default), they remain filtered out.
        // This logic seems fine.
    }
    
    if (filters.regulation !== "all") {
      tempProducts = tempProducts.filter(dpp => {
          const complianceData = dpp.compliance[filters.regulation as keyof typeof dpp.compliance];
          return complianceData && typeof complianceData === 'object' && 'status' in complianceData && (complianceData.status as string).toLowerCase() === 'compliant';
      });
    }

    if (filters.category !== "all") {
      tempProducts = tempProducts.filter(dpp => dpp.category === filters.category);
    }
    
    if (filters.blockchainAnchored === 'anchored') tempProducts = tempProducts.filter(dpp => !!dpp.blockchainIdentifiers?.anchorTransactionHash);
    if (filters.blockchainAnchored === 'not_anchored') tempProducts = tempProducts.filter(dpp => !dpp.blockchainIdentifiers?.anchorTransactionHash);
    
    if (filters.manufacturer !== "all") tempProducts = tempProducts.filter(dpp => dpp.manufacturer?.name === filters.manufacturer);
    
    if (filters.onChainStatus && filters.onChainStatus !== "all") tempProducts = tempProducts.filter(dpp => dpp.metadata.onChainStatus === filters.onChainStatus);

    if (filters.completeness !== "all") {
      tempProducts = tempProducts.filter(dpp => {
        const score = dpp.completeness.score;
        if (filters.completeness === '>75' && score <= 75) return false;
        if (filters.completeness === '50-75' && (score < 50 || score > 75)) return false;
        if (filters.completeness === '<50' && score >= 50) return false;
        return true;
      });
    }

    if (filters.isTextileProduct === true) tempProducts = tempProducts.filter(dpp => !!dpp.textileInformation);
    if (filters.isTextileProduct === false) tempProducts = tempProducts.filter(dpp => !dpp.textileInformation);

    if (filters.isConstructionProduct === true) tempProducts = tempProducts.filter(dpp => !!dpp.constructionProductInformation);
    if (filters.isConstructionProduct === false) tempProducts = tempProducts.filter(dpp => !dpp.constructionProductInformation);

    if (sortConfig.key && sortConfig.direction) {
      tempProducts.sort((a, b) => {
        let valA: any; let valB: any;
        if (sortConfig.key === 'completenessScore') { valA = a.completeness.score; valB = b.completeness.score; }
        else if (sortConfig.key === 'manufacturer.name') { valA = a.manufacturer?.name; valB = b.manufacturer?.name; }
        else if (sortConfig.key === 'overallCompliance') { valA = a.overallCompliance.text; valB = b.overallCompliance.text; }
        else { valA = getSortValue(a, sortConfig.key!); valB = getSortValue(b, sortConfig.key!); }

        if (typeof valA === 'string' && typeof valB === 'string') { valA = valA.toLowerCase(); valB = valB.toLowerCase(); }
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
  }, [roleScopedProcessedDpps, filters, sortConfig]);

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
    
    const productPageMetrics = { // This is for the Products page's specific metric cards
        active: sourceForMetrics.filter(d => d.metadata.status === 'published' && !d.metadata.isArchived).length,
        draft: sourceForMetrics.filter(d => d.metadata.status === 'draft' && !d.metadata.isArchived).length,
        issues: sourceForMetrics.filter(d => d.overallCompliance.text === 'Non-Compliant' && !d.metadata.isArchived).length,
    };

    return { 
        totalDPPs, 
        compliantPercentage, 
        pendingReviewDPPs, 
        totalConsumerScans, 
        averageConsumerScans, 
        averageCompleteness, 
        metrics: productPageMetrics,
        allDpps: allProcessedDpps // Expose all processed DPPs for filter option generation
    };
  }, [sortedAndFilteredDPPs, filters, allProcessedDpps]); 

  const categoryDistribution = useMemo(() => {
    const sourceForChart = sortedAndFilteredDPPs; 
    const counts: Record<string, number> = {};
    sourceForChart.forEach(dpp => {
      counts[dpp.category] = (counts[dpp.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [sortedAndFilteredDPPs, filters]); 

  const complianceDistribution = useMemo(() => {
    const sourceForChart = sortedAndFilteredDPPs; 
    const counts: Record<string, number> = {};
    sourceForChart.forEach(dpp => {
      const statusText = dpp.overallCompliance.text;
      counts[statusText] = (counts[statusText] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [sortedAndFilteredDPPs, filters]);

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
    
    const updatedAllRawDpps = allRawDpps.map(p => 
      p.id === productToDeleteId 
        ? { ...p, metadata: { ...p.metadata, isArchived: true, status: 'archived', last_updated: new Date().toISOString() } } 
        : p
    );
    setAllRawDpps(updatedAllRawDpps);

    const updatedAllProcessedDpps = allProcessedDpps.map(p =>
      p.id === productToDeleteId
        ? { ...p, metadata: { ...p.metadata, isArchived: true, status: 'archived', last_updated: new Date().toISOString() } }
        : p
    );
    setAllProcessedDpps(updatedAllProcessedDpps);

    if (productIsUserAdded) {
      const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
      let userProducts: DigitalProductPassport[] = storedProductsString ? JSON.parse(storedProductsString) : [];
      const productIndex = userProducts.findIndex(p => p.id === productToDeleteId);
      if (productIndex > -1) {
        userProducts[productIndex].metadata.isArchived = true;
        userProducts[productIndex].metadata.status = 'archived';
        userProducts[productIndex].metadata.last_updated = new Date().toISOString();
        localStorage.setItem(USER_PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(userProducts));
      }
    }
    
    const productName = allRawDpps.find(p=>p.id === productToDeleteId)?.productName || productToDeleteId;
    toast({ title: "Product Archived", description: `Product "${productName}" has been archived.` });
    setIsDeleteDialogOpen(false);
    setProductToDeleteId(null);
  }, [productToDeleteId, toast, allRawDpps, allProcessedDpps]);

  return {
    dpps: allProcessedDpps, 
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

