
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
  includeArchived: false, // Default to not including archived
};

const getRoleDefaultFilters = (role: UserRole): Partial<DashboardFiltersState> => {
  switch (role) {
    case 'admin':
      return { ...defaultFiltersBase, status: "all", includeArchived: false }; 
    case 'manufacturer':
      // For demo, assuming manufacturer "GreenTech Appliances" or "PowerVolt" or user-added.
      // In a real app, this would be tied to the logged-in user's organization.
      return { ...defaultFiltersBase, status: "all", manufacturer: "GreenTech Appliances", includeArchived: false };
    case 'verifier':
      return { ...defaultFiltersBase, status: "pending_review", includeArchived: false };
    case 'retailer':
    case 'supplier':
      return { ...defaultFiltersBase, status: "published", includeArchived: false };
    case 'recycler':
      return { ...defaultFiltersBase, status: "all", includeArchived: true }; // Recyclers see all including archived
    default:
      return { ...defaultFiltersBase, status: "published", includeArchived: false };
  }
};

export function useDPPLiveData() {
  const router = useRouter();
  const { toast } = useToast();
  const { currentRole } = useRole();

  const [allRawDpps, setAllRawDpps] = useState<DigitalProductPassport[]>([]);
  const [allProcessedDpps, setAllProcessedDpps] = useState<ProcessedDPP[]>([]);
  
  const [filters, setFilters] = useState<DashboardFiltersState>(() => ({
    ...defaultFiltersBase, // Start with base defaults
    ...getRoleDefaultFilters(currentRole), // Override with role-specific defaults
    searchQuery: "", // Explicitly ensure search query starts empty or is preserved if needed
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

  // Effect 2: Update filters when role changes
  useEffect(() => {
    setFilters(prevFilters => ({
      ...defaultFiltersBase, // Reset to base defaults
      ...getRoleDefaultFilters(currentRole), // Apply new role defaults
      searchQuery: prevFilters.searchQuery, // Preserve existing search query
    }));
  }, [currentRole]);

  const availableCategories = useMemo(() => {
    const categories = new Set(allProcessedDpps.map(dpp => dpp.category));
    return Array.from(categories).sort();
  }, [allProcessedDpps]);

  const availableManufacturers = useMemo(() => {
    const manufacturers = new Set(allProcessedDpps.map(dpp => dpp.manufacturer?.name).filter(Boolean) as string[]);
    return ["all", ...Array.from(manufacturers).sort()];
  }, [allProcessedDpps]);

  // Primary data derivation pipeline
  const sortedAndFilteredDPPs = useMemo(() => {
    let currentScopedDpps = [...allProcessedDpps];

    // 1. Apply Role-Based Scoping (non-overridable base visibility)
    switch (currentRole) {
        case 'admin':
            // Admin sees all non-archived by default, unless 'archived' status filter is active
            if (filters.status !== 'archived') {
              currentScopedDpps = currentScopedDpps.filter(dpp => !dpp.metadata.isArchived);
            }
            break;
        case 'manufacturer':
            currentScopedDpps = currentScopedDpps.filter(dpp =>
                (dpp.manufacturer?.name === "GreenTech Appliances" || 
                 dpp.manufacturer?.name === "EcoThreads" || 
                 dpp.manufacturer?.name === "PowerVolt" || 
                 dpp.manufacturer?.name === "BuildGreen Systems" || 
                 dpp.id.startsWith("USER_PROD")) &&
                (filters.status === 'archived' ? dpp.metadata.isArchived : !dpp.metadata.isArchived)
            );
            break;
        case 'verifier':
            currentScopedDpps = currentScopedDpps.filter(dpp => 
                !dpp.metadata.isArchived && 
                (dpp.metadata.status === 'pending_review' || dpp.metadata.status === 'flagged')
            );
            break;
        case 'retailer':
        case 'supplier':
            currentScopedDpps = currentScopedDpps.filter(dpp => 
                !dpp.metadata.isArchived && dpp.metadata.status === 'published'
            );
            break;
        case 'recycler':
            currentScopedDpps = currentScopedDpps.filter(dpp => 
                (!dpp.metadata.isArchived && dpp.metadata.status === 'published') || 
                dpp.metadata.isArchived === true
            );
            break;
        default: // Default to only published, non-archived if role is unknown
            currentScopedDpps = currentScopedDpps.filter(dpp => !dpp.metadata.isArchived && dpp.metadata.status === 'published');
            break;
    }

    // 2. Apply User-Selected Filters on top of role-scoped data
    let userFilteredDpps = [...currentScopedDpps];

    if (filters.searchQuery) {
      const lowerSearch = filters.searchQuery.toLowerCase();
      userFilteredDpps = userFilteredDpps.filter(dpp =>
        dpp.productName.toLowerCase().includes(lowerSearch) ||
        dpp.id.toLowerCase().includes(lowerSearch) ||
        (dpp.gtin && dpp.gtin.toLowerCase().includes(lowerSearch)) ||
        (dpp.manufacturer?.name && dpp.manufacturer.name.toLowerCase().includes(lowerSearch))
      );
    }
    
    if (filters.status !== "all") {
      if (filters.status === "archived") {
        userFilteredDpps = userFilteredDpps.filter(dpp => dpp.metadata.isArchived === true);
      } else {
        // For other statuses, ensure we are not showing archived items unless the role (like recycler) already included them
        userFilteredDpps = userFilteredDpps.filter(dpp => dpp.metadata.status === filters.status && 
            (currentRole === 'recycler' ? true : !dpp.metadata.isArchived)
        );
      }
    } else if (currentRole !== 'recycler') { // If status is "all" and not recycler, still exclude archived
        userFilteredDpps = userFilteredDpps.filter(dpp => !dpp.metadata.isArchived);
    }
    // For Recycler with 'all' status, `currentScopedDpps` already correctly includes archived and non-archived published.
    
    if (filters.regulation !== "all") {
      userFilteredDpps = userFilteredDpps.filter(dpp => {
          const complianceData = dpp.compliance[filters.regulation as keyof typeof dpp.compliance];
          return complianceData && typeof complianceData === 'object' && 'status' in complianceData && (complianceData.status as string).toLowerCase() === 'compliant';
      });
    }

    if (filters.category !== "all") {
      userFilteredDpps = userFilteredDpps.filter(dpp => dpp.category === filters.category);
    }
    
    if (filters.blockchainAnchored === 'anchored') userFilteredDpps = userFilteredDpps.filter(dpp => !!dpp.blockchainIdentifiers?.anchorTransactionHash);
    if (filters.blockchainAnchored === 'not_anchored') userFilteredDpps = userFilteredDpps.filter(dpp => !dpp.blockchainIdentifiers?.anchorTransactionHash);
    
    if (filters.manufacturer !== "all") userFilteredDpps = userFilteredDpps.filter(dpp => dpp.manufacturer?.name === filters.manufacturer);
    
    if (filters.onChainStatus && filters.onChainStatus !== "all") {
        userFilteredDpps = userFilteredDpps.filter(dpp => (dpp.metadata.onChainStatus || "Unknown") === filters.onChainStatus);
    }

    if (filters.completeness !== "all") {
      userFilteredDpps = userFilteredDpps.filter(dpp => {
        const score = dpp.completeness.score;
        if (filters.completeness === '>75' && score <= 75) return false;
        if (filters.completeness === '50-75' && (score < 50 || score > 75)) return false;
        if (filters.completeness === '<50' && score >= 50) return false;
        return true;
      });
    }

    if (filters.isTextileProduct === true) userFilteredDpps = userFilteredDpps.filter(dpp => !!dpp.textileInformation);
    if (filters.isTextileProduct === false) userFilteredDpps = userFilteredDpps.filter(dpp => !dpp.textileInformation);

    if (filters.isConstructionProduct === true) userFilteredDpps = userFilteredDpps.filter(dpp => !!dpp.constructionProductInformation);
    if (filters.isConstructionProduct === false) userFilteredDpps = userFilteredDpps.filter(dpp => !dpp.constructionProductInformation);

    // 3. Sort the final list
    if (sortConfig.key && sortConfig.direction) {
      userFilteredDpps.sort((a, b) => {
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
    return userFilteredDpps;
  }, [allProcessedDpps, filters, sortConfig, currentRole]);


  const metrics = useMemo(() => {
    const sourceForMetrics = sortedAndFilteredDPPs; // Base metrics on the final filtered list
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
        metrics: productPageMetrics,
        allDpps: allProcessedDpps 
    };
  }, [sortedAndFilteredDPPs, filters]); // Added filters to dependency array

  const categoryDistribution = useMemo(() => {
    const sourceForChart = sortedAndFilteredDPPs; 
    const counts: Record<string, number> = {};
    sourceForChart.forEach(dpp => {
      counts[dpp.category] = (counts[dpp.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [sortedAndFilteredDPPs, filters]); // Added filters

  const complianceDistribution = useMemo(() => {
    const sourceForChart = sortedAndFilteredDPPs; 
    const counts: Record<string, number> = {};
    sourceForChart.forEach(dpp => {
      const statusText = dpp.overallCompliance.text;
      counts[statusText] = (counts[statusText] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [sortedAndFilteredDPPs, filters]); // Added filters

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
    setAllRawDpps(updatedRawDpps); 

    const updatedProcessedDpps = allProcessedDpps.map(p => 
      p.id === productToDeleteId 
        ? { ...p, metadata: { ...p.metadata, isArchived: true, status: 'archived', last_updated: new Date().toISOString() } } 
        : p
    );
    setAllProcessedDpps(updatedProcessedDpps);

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
