
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

const getRoleDefaultFilters = (role: UserRole): Partial<DashboardFiltersState> => {
  switch (role) {
    case 'admin':
      return { ...defaultFiltersBase, status: "all" }; // Admins see all non-archived by default
    case 'manufacturer':
      return { ...defaultFiltersBase, status: "all" }; // Manufacturers see all their relevant statuses
    case 'verifier':
      return { ...defaultFiltersBase, status: "pending_review" };
    case 'retailer':
    case 'supplier':
      return { ...defaultFiltersBase, status: "published" };
    case 'recycler':
      return { ...defaultFiltersBase, status: "all" }; // Recyclers can see published & archived
    default:
      return { ...defaultFiltersBase, status: "published" };
  }
};

export function useDPPLiveData() {
  const router = useRouter();
  const { toast } = useToast();
  const { currentRole } = useRole();

  const [allRawDpps, setAllRawDpps] = useState<DigitalProductPassport[]>([]);
  const [allProcessedDpps, setAllProcessedDpps] = useState<ProcessedDPP[]>([]);
  
  const [filters, setFilters] = useState<DashboardFiltersState>(() => ({
    ...getRoleDefaultFilters(currentRole), 
    searchQuery: "" 
  }));
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'id', direction: 'ascending' });
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Effect 1: Load and process all DPPs once on initial mount or when raw data might change externally
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
  }, []); // Runs once

  // Effect 2: Update filters when role changes
  useEffect(() => {
    setFilters(prevFilters => ({
      ...getRoleDefaultFilters(currentRole),
      searchQuery: prevFilters.searchQuery, // Preserve search query
    }));
  }, [currentRole]);

  const availableCategories = useMemo(() => {
    const categories = new Set(allRawDpps.map(dpp => dpp.category));
    return Array.from(categories).sort();
  }, [allRawDpps]);

  const availableManufacturers = useMemo(() => {
    const manufacturers = new Set(allRawDpps.map(dpp => dpp.manufacturer?.name).filter(Boolean) as string[]);
    return ["all", ...Array.from(manufacturers).sort()];
  }, [allRawDpps]);

  const roleScopedAndFilteredDPPs: ProcessedDPP[] = useMemo(() => {
    let tempProducts = [...allProcessedDpps];

    // Apply Role-Based Scoping First
    switch (currentRole) {
      case 'admin':
        // Admin sees all non-archived by default, unless 'archived' is specifically filtered.
        if (filters.status !== 'archived') {
          tempProducts = tempProducts.filter(dpp => !dpp.metadata.isArchived);
        }
        break;
      case 'manufacturer':
        // Example: filter by manufacturer name for demo. In real app, this would be by user's org.
        // Also, manufacturer might see draft, pending, published, flagged, but not archived by default.
        tempProducts = tempProducts.filter(dpp => 
          !dpp.metadata.isArchived &&
          (dpp.manufacturer?.name === "GreenTech Appliances" || dpp.manufacturer?.name === "EcoThreads" || dpp.manufacturer?.name === "PowerVolt" || dpp.manufacturer?.name === "BuildGreen Systems" || dpp.id.startsWith("USER_PROD")) &&
          (filters.status === 'all' || dpp.metadata.status === filters.status || 
           (filters.status === 'archived' && dpp.metadata.isArchived)) // Allow viewing archived if filter selected
        );
        break;
      case 'verifier':
        tempProducts = tempProducts.filter(dpp => 
          !dpp.metadata.isArchived && 
          (dpp.metadata.status === 'pending_review' || dpp.metadata.status === 'flagged')
        );
        break;
      case 'retailer':
      case 'supplier':
        tempProducts = tempProducts.filter(dpp => 
          !dpp.metadata.isArchived && dpp.metadata.status === 'published'
        );
        break;
      case 'recycler':
        // Recycler sees published (non-archived) AND all archived products.
        tempProducts = tempProducts.filter(dpp => 
            (dpp.metadata.status === 'published' && !dpp.metadata.isArchived) || dpp.metadata.isArchived === true
        );
        break;
      default:
        tempProducts = tempProducts.filter(dpp => !dpp.metadata.isArchived && dpp.metadata.status === 'published');
        break;
    }

    // Apply User-Selected Filters
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
        tempProducts = tempProducts.filter(dpp => dpp.metadata.isArchived === true);
      } else {
        tempProducts = tempProducts.filter(dpp => dpp.metadata.status === filters.status && !dpp.metadata.isArchived);
      }
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
    
    if (filters.onChainStatus && filters.onChainStatus !== "all") { // Changed from "All" to "all"
        tempProducts = tempProducts.filter(dpp => (dpp.metadata.onChainStatus || "Unknown") === filters.onChainStatus);
    }


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

    // Sort the final list
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
  }, [allProcessedDpps, filters, sortConfig, currentRole]);


  const metrics = useMemo(() => {
    const sourceForMetrics = roleScopedAndFilteredDPPs; // Base metrics on the fully filtered list
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
    
    const productPageMetrics = { 
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
        metrics: productPageMetrics, // For Product Management page
        allDpps: allProcessedDpps // Keep exposing this for filter dropdown population
    };
  }, [roleScopedAndFilteredDPPs, filters, allProcessedDpps]); 

  const categoryDistribution = useMemo(() => {
    const sourceForChart = roleScopedAndFilteredDPPs; 
    const counts: Record<string, number> = {};
    sourceForChart.forEach(dpp => {
      counts[dpp.category] = (counts[dpp.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [roleScopedAndFilteredDPPs, filters]); 

  const complianceDistribution = useMemo(() => {
    const sourceForChart = roleScopedAndFilteredDPPs; 
    const counts: Record<string, number> = {};
    sourceForChart.forEach(dpp => {
      const statusText = dpp.overallCompliance.text;
      counts[statusText] = (counts[statusText] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [roleScopedAndFilteredDPPs, filters]);

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
    
    const updatedRawDpps = allRawDpps.map(p => 
      p.id === productToDeleteId 
        ? { ...p, metadata: { ...p.metadata, isArchived: true, status: 'archived', last_updated: new Date().toISOString() } } 
        : p
    );
    setAllRawDpps(updatedRawDpps); // This will trigger reprocessing

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
  }, [productToDeleteId, toast, allRawDpps]);

  return {
    dpps: allProcessedDpps, // This still returns all for things like Scan Product Dialog
    filters,
    sortConfig,
    productToDeleteId,
    isDeleteDialogOpen,
    availableCategories,
    availableManufacturers, 
    sortedAndFilteredDPPs: roleScopedAndFilteredDPPs, // This is the list for display
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
