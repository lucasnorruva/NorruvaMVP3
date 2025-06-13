
// --- File: useDPPLiveData.ts ---
// Description: Custom hook to manage data fetching, state, filtering, sorting, and actions for the DPP Live Dashboard.
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { DigitalProductPassport, DashboardFiltersState, SortConfig, SortableKeys, DisplayableProduct } from '@/types/dpp';
import { MOCK_DPPS } from '@/data';
import { getSortValue } from '@/utils/sortUtils';
import { calculateDppCompletenessForList, getOverallComplianceDetails } from '@/utils/dppDisplayUtils'; // Import completeness calculation
import { useToast } from '@/hooks/use-toast';
import { useRole, type UserRole } from '@/contexts/RoleContext'; // Import useRole

const USER_PRODUCTS_LOCAL_STORAGE_KEY = 'norruvaUserProducts';

// Extended type for DPPs processed by the hook
export interface ProcessedDPP extends DigitalProductPassport {
  completeness: { score: number; filledFields: number; totalFields: number; missingFields: string[] };
  overallCompliance: ReturnType<typeof getOverallComplianceDetails>;
}


export function useDPPLiveData() {
  const router = useRouter();
  const { toast } = useToast();
  const { currentRole } = useRole(); // Get current role

  const [dpps, setDpps] = useState<DigitalProductPassport[]>([]);
  const [filters, setFilters] = useState<DashboardFiltersState>({
    status: "all",
    regulation: "all",
    category: "all",
    searchQuery: "",
    blockchainAnchored: "all",
    manufacturer: "all", 
    completeness: "all", 
    onChainStatus: "all",
  });
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

  // Effect to set role-based default filters
  useEffect(() => {
    let roleBasedFilters: Partial<DashboardFiltersState> = {
      status: "all", // Default for most
      regulation: "all",
      category: "all",
      // searchQuery: "", // Don't clear search query on role change
      blockchainAnchored: "all",
      manufacturer: "all",
      completeness: "all",
      onChainStatus: "all",
    };

    switch (currentRole) {
      case 'admin':
      case 'manufacturer':
        // Admins and Manufacturers see all by default
        break;
      case 'supplier':
      case 'retailer':
        roleBasedFilters.status = "published";
        break;
      case 'recycler':
        roleBasedFilters.status = "published"; // Or perhaps "archived" or "all"
        roleBasedFilters.category = "Electronics"; // Example: recyclers focus on electronics
        break;
      case 'verifier':
        roleBasedFilters.status = "pending_review";
        break;
      default:
        break;
    }
    // Preserve search query if it exists, otherwise apply full role-based defaults
    setFilters(prevFilters => ({
      ...roleBasedFilters, // Apply new role-based defaults
      searchQuery: prevFilters.searchQuery, // Keep existing search query
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
    const fetchIncludeArchived = filters.status === 'archived' || filters.status === 'all';
    let apiFetchedDpps = processedDPPs;
    if (!fetchIncludeArchived) {
      apiFetchedDpps = processedDPPs.filter(dpp => !dpp.metadata.isArchived);
    }
    
    let filtered = apiFetchedDpps.filter((dpp) => {
      if (filters.searchQuery && !dpp.productName.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
      
      if (filters.status !== "all") {
        if (filters.status === "archived") {
          if (!dpp.metadata.isArchived) return false;
        } else {
          if (dpp.metadata.isArchived || dpp.metadata.status !== filters.status) return false;
        }
      }
      
      if (filters.regulation !== "all") {
        const complianceData = dpp.compliance[filters.regulation as keyof typeof dpp.compliance];
        if (!complianceData || (typeof complianceData === 'object' && 'status' in complianceData && complianceData.status !== 'compliant')) return false;
      }
      if (filters.category !== "all" && dpp.category !== filters.category) return false;
      if (filters.blockchainAnchored === 'anchored' && !dpp.blockchainIdentifiers?.anchorTransactionHash) return false;
      if (filters.blockchainAnchored === 'not_anchored' && dpp.blockchainIdentifiers?.anchorTransactionHash) return false;
      if (filters.manufacturer !== "all" && dpp.manufacturer?.name !== filters.manufacturer) return false;
      if (filters.onChainStatus !== "all" && dpp.metadata.onChainStatus !== filters.onChainStatus) return false;

      if (filters.completeness !== "all") {
        const score = dpp.completeness.score;
        if (filters.completeness === '>75' && score <= 75) return false;
        if (filters.completeness === '50-75' && (score < 50 || score > 75)) return false;
        if (filters.completeness === '<50' && score >= 50) return false;
      }
      return true;
    });

    if (sortConfig.key && sortConfig.direction) {
      filtered.sort((a, b) => {
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
    return filtered;
  }, [processedDPPs, filters, sortConfig]);

  const metrics = useMemo(() => {
    const nonArchivedDpps = dpps.filter(dpp => !dpp.metadata.isArchived);
    const totalDPPs = nonArchivedDpps.length;
    
    const fullyCompliantDPPsCount = nonArchivedDpps.filter(dpp => {
        const complianceDetails = getOverallComplianceDetails(dpp);
        return complianceDetails.text.toLowerCase().includes('compliant');
    }).length;

    const compliantPercentage = totalDPPs > 0 
      ? ((fullyCompliantDPPsCount / totalDPPs) * 100).toFixed(1) + "%" 
      : "0%";
    const pendingReviewDPPs = nonArchivedDpps.filter(d => d.metadata.status === 'pending_review').length;
    const totalConsumerScans = nonArchivedDpps.reduce((sum, dpp) => sum + (dpp.consumerScans || 0), 0);
    const averageConsumerScans = totalDPPs > 0 ? (totalConsumerScans / totalDPPs).toFixed(1) : "0";
    const averageCompleteness = totalDPPs > 0 
      ? (processedDPPs.filter(p => !p.metadata.isArchived).reduce((sum, p) => sum + p.completeness.score, 0) / totalDPPs).toFixed(1) + "%" 
      : "0%";

    return { totalDPPs, compliantPercentage, pendingReviewDPPs, totalConsumerScans, averageConsumerScans, averageCompleteness };
  }, [dpps, processedDPPs]);

  const categoryDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    sortedAndFilteredDPPs.forEach(dpp => {
      counts[dpp.category] = (counts[dpp.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [sortedAndFilteredDPPs]);

  const complianceDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    sortedAndFilteredDPPs.forEach(dpp => {
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
    if (productIsUserAdded) {
      const storedProductsString = localStorage.getItem(USER_PRODUCTS_LOCAL_STORAGE_KEY);
      let userProducts: DigitalProductPassport[] = storedProductsString ? JSON.parse(storedProductsString) : [];
      userProducts = userProducts.filter(p => p.id !== productToDeleteId);
      localStorage.setItem(USER_PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(userProducts));
    }
    
    const productIndex = dpps.findIndex(p => p.id === productToDeleteId);
    if (productIndex !== -1) {
      const updatedDpps = dpps.map(p => 
        p.id === productToDeleteId 
          ? { ...p, metadata: { ...p.metadata, isArchived: true, last_updated: new Date().toISOString() } } 
          : p
      );
      setDpps(updatedDpps); 
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
