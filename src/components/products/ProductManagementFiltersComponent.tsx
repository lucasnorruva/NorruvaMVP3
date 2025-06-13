
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"; 
import { Filter, ListFilter, Search, Tag, ShieldAlert, CheckSquare, Link as LinkIcon, XCircle, SlidersHorizontal, Shirt, Construction, Sigma } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface ProductManagementFilterState {
  searchQuery: string;
  status: string;
  compliance: string;
  category: string;
  blockchainAnchored?: 'all' | 'anchored' | 'not_anchored';
  isTextileProduct?: boolean; 
  isConstructionProduct?: boolean; 
  onChainStatus?: string;
}

interface ProductManagementFiltersComponentProps {
  filters: ProductManagementFilterState;
  onFilterChange: (filters: ProductManagementFilterState) => void;
  statusOptions: string[];
  complianceOptions: string[];
  categoryOptions: string[];
}

const defaultFilters: ProductManagementFilterState = {
  searchQuery: "",
  status: "All",
  compliance: "All",
  category: "All",
  blockchainAnchored: "all",
  isTextileProduct: undefined, 
  isConstructionProduct: undefined, 
  onChainStatus: "All",
};

export default function ProductManagementFiltersComponent({
  filters,
  onFilterChange,
  statusOptions,
  complianceOptions,
  categoryOptions,
}: ProductManagementFiltersComponentProps) {

  const handleInputChange = (filterName: keyof ProductManagementFilterState, value: string | boolean | undefined) => {
    onFilterChange({ ...filters, [filterName]: value });
  };

  const anchoringOptions = [
    { value: "all", label: "All Anchoring Statuses" },
    { value: "anchored", label: "Anchored" },
    { value: "not_anchored", label: "Not Anchored" },
  ];

  const onChainStatusOptions = [
    { value: "All", label: "All On-Chain Statuses" },
    { value: "Unknown", label: "Unknown" },
    { value: "Active", label: "Active" },
    { value: "Pending Activation", label: "Pending Activation" },
    { value: "Recalled", label: "Recalled" },
    { value: "Flagged for Review", label: "Flagged for Review" },
    { value: "Archived", label: "Archived" },
  ];

  const handleClearFilters = () => {
    onFilterChange(defaultFilters);
  };

  const activeFilterCount = [
    filters.searchQuery && filters.searchQuery.length > 0,
    filters.status !== defaultFilters.status,
    filters.compliance !== defaultFilters.compliance,
    filters.category !== defaultFilters.category,
    filters.blockchainAnchored !== defaultFilters.blockchainAnchored,
    filters.isTextileProduct !== defaultFilters.isTextileProduct,
    filters.isConstructionProduct !== defaultFilters.isConstructionProduct,
    filters.onChainStatus !== defaultFilters.onChainStatus,
  ].filter(Boolean).length;

  return (
    <Card className="shadow-md">
      <CardContent className="p-0">
        <Accordion type="single" collapsible defaultValue="filter-section" className="w-full">
          <AccordionItem value="filter-section" className="border-b-0">
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50 rounded-t-lg [&[data-state=open]]:rounded-b-none [&[data-state=open]]:border-b">
              <div className="flex items-center text-md font-medium">
                <SlidersHorizontal className="h-5 w-5 mr-2 text-primary" />
                Filter & Search Products
                {activeFilterCount > 0 && (
                  <Badge className={cn(
                    "ml-2 px-2 py-0.5 text-xs font-semibold rounded-full",
                    "bg-primary/20 text-primary border-primary/30" 
                  )}>
                    {activeFilterCount} active
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-end p-4 border-t"> {/* Adjusted to xl:grid-cols-6 */}
                <div>
                  <Label htmlFor="search-query-pm" className="text-sm font-medium mb-1 flex items-center">
                    <Search className="h-4 w-4 mr-2 text-primary" />
                    Search (Name, GTIN, Brand)
                  </Label>
                  <Input
                    id="search-query-pm"
                    type="text"
                    placeholder="Enter search term..."
                    value={filters.searchQuery}
                    onChange={(e) => handleInputChange('searchQuery', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="status-filter-pm" className="text-sm font-medium mb-1 flex items-center">
                    <CheckSquare className="h-4 w-4 mr-2 text-primary" />
                    DPP Platform Status
                  </Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger id="status-filter-pm" className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={`pm-status-${option}`} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="compliance-filter-pm" className="text-sm font-medium mb-1 flex items-center">
                    <ShieldAlert className="h-4 w-4 mr-2 text-primary" />
                    Compliance Status
                  </Label>
                  <Select
                    value={filters.compliance}
                    onValueChange={(value) => handleInputChange('compliance', value)}
                  >
                    <SelectTrigger id="compliance-filter-pm" className="w-full">
                      <SelectValue placeholder="Select compliance status" />
                    </SelectTrigger>
                    <SelectContent>
                      {complianceOptions.map((option) => (
                        <SelectItem key={`pm-comp-${option}`} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category-filter-pm" className="text-sm font-medium mb-1 flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-primary" />
                    Filter by Category
                  </Label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger id="category-filter-pm" className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((category) => (
                        <SelectItem key={`pm-cat-${category}`} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="anchoring-filter-pm-acc" className="text-sm font-medium mb-1 flex items-center">
                    <LinkIcon className="h-4 w-4 mr-1.5 text-primary" />
                    Blockchain Anchoring
                  </Label>
                  <Select
                    value={filters.blockchainAnchored || 'all'}
                    onValueChange={(value) => handleInputChange('blockchainAnchored', value as ProductManagementFilterState['blockchainAnchored'])}
                  >
                    <SelectTrigger id="anchoring-filter-pm-acc" className="w-full">
                      <SelectValue placeholder="Select anchoring status" />
                    </SelectTrigger>
                    <SelectContent>
                      {anchoringOptions.map((option) => (
                        <SelectItem key={`pm-anchor-acc-${option.value}`} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div> {/* New On-Chain Status Filter */}
                  <Label htmlFor="onchain-status-filter-pm" className="text-sm font-medium mb-1 flex items-center">
                    <Sigma className="h-4 w-4 mr-1.5 text-primary" />
                    On-Chain Status
                  </Label>
                  <Select
                    value={filters.onChainStatus || 'All'}
                    onValueChange={(value) => handleInputChange('onChainStatus', value)}
                  >
                    <SelectTrigger id="onchain-status-filter-pm" className="w-full">
                      <SelectValue placeholder="Select on-chain status" />
                    </SelectTrigger>
                    <SelectContent>
                      {onChainStatusOptions.map((option) => (
                        <SelectItem key={`pm-onchain-${option.value}`} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-5">
                  <Checkbox
                    id="isTextileProduct"
                    checked={filters.isTextileProduct}
                    onCheckedChange={(checked) => handleInputChange('isTextileProduct', checked === 'indeterminate' ? undefined : checked as boolean)}
                  />
                  <Label htmlFor="isTextileProduct" className="text-sm font-medium flex items-center">
                    <Shirt className="h-4 w-4 mr-1.5 text-primary" />
                    Is Textile Product
                  </Label>
                </div>
                <div className="flex items-center space-x-2 pt-5">
                  <Checkbox
                    id="isConstructionProduct"
                    checked={filters.isConstructionProduct}
                    onCheckedChange={(checked) => handleInputChange('isConstructionProduct', checked === 'indeterminate' ? undefined : checked as boolean)}
                  />
                  <Label htmlFor="isConstructionProduct" className="text-sm font-medium flex items-center">
                    <Construction className="h-4 w-4 mr-1.5 text-primary" />
                    Is Construction Product
                  </Label>
                </div>
              </div>
              {activeFilterCount > 0 && (
                <div className="p-4 pt-2 text-right">
                  <Button variant="outline" size="sm" onClick={handleClearFilters}>
                    <XCircle className="mr-2 h-4 w-4" /> Clear All Filters
                  </Button>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

