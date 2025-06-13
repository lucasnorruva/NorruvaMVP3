
// --- File: page.tsx (Product Management List) ---
// Description: Main page for listing and managing all products.

"use client";

import Link from "next/link";
import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Package as PackageIcon, CheckCircle2, FileText as FileTextIconPg, ArrowDown, ArrowUp, ChevronsUpDown, PieChart, Edit3, Sigma } from "lucide-react"; 
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRole } from "@/contexts/RoleContext";
import { useToast } from "@/hooks/use-toast";
import type { StoredUserProduct, RichMockProduct, DisplayableProduct, DigitalProductPassport, SortConfig as ProductSortConfig, SortableKeys as ProductSortableKeys } from "@/types/dpp"; 
import { USER_PRODUCTS_LOCAL_STORAGE_KEY } from "@/types/dpp";
import ProductManagementFiltersComponent, { type ProductManagementFilterState } from "@/components/products/ProductManagementFiltersComponent";
import { MetricCard } from "@/components/dpp-dashboard/MetricCard";
import { ProductListRow } from "@/components/products/ProductListRow";
import { calculateDppCompletenessForList } from "@/utils/dppDisplayUtils";
import { cn } from "@/lib/utils";
import { MOCK_DPPS as InitialMockDppsData } from '@/data'; 
import { useDPPLiveData, ProcessedDPP } from '@/hooks/useDPPLiveData'; 


const SortableTableHead: React.FC<{
  columnKey: ProductSortableKeys;
  title: string;
  onSort: (key: ProductSortableKeys) => void;
  sortConfig: ProductSortConfig;
  className?: string;
}> = ({ columnKey, title, onSort, sortConfig, className }) => {
  const isSorted = sortConfig.key === columnKey;
  const Icon = isSorted ? (sortConfig.direction === 'ascending' ? ArrowUp : ArrowDown) : ChevronsUpDown;
  return (
    <TableHead className={cn("cursor-pointer hover:bg-muted/50 transition-colors", className)} onClick={() => onSort(columnKey)}>
      <div className="flex items-center gap-1">
        {title}
        <Icon className={cn("h-3.5 w-3.5", isSorted ? "text-primary" : "text-muted-foreground/70")} />
      </div>
    </TableHead>
  );
};


export default function ProductsPage() {
  const { currentRole } = useRole();
  const { 
    filters, 
    sortConfig, 
    isDeleteDialogOpen, 
    availableCategories,
    availableManufacturers, // Now available from the hook
    sortedAndFilteredDPPs, 
    metrics, // Metrics are now derived from filtered data in the hook
    handleFiltersChange, 
    handleSort, 
    handleDeleteRequest, 
    confirmDeleteProduct, 
    setIsDeleteDialogOpen,
    toast
  } = useDPPLiveData(); // Use the comprehensive hook

  const [productToDeleteForDialog, setProductToDeleteForDialog] = useState<ProcessedDPP | null>(null);

  const openDeleteConfirmDialog = (product: ProcessedDPP) => {
    setProductToDeleteForDialog(product);
    handleDeleteRequest(product.id); // This will set productToDeleteId in the hook and open the dialog
  };

  const handleDeleteProduct = () => {
    confirmDeleteProduct(); // Call the hook's delete function
    setProductToDeleteForDialog(null); // Clear local state after hook handles it
  };

  const canAddProducts = currentRole === 'admin' || currentRole === 'manufacturer';

  const statusOptions = useMemo(() => {
    const uniqueStatuses = new Set(sortedAndFilteredDPPs.map(p => p.metadata.status).filter(Boolean).sort());
    return ["All", ...Array.from(uniqueStatuses)];
  }, [sortedAndFilteredDPPs]);

  const complianceOptions = useMemo(() => {
    const uniqueCompliance = new Set(sortedAndFilteredDPPs.map(p => p.overallCompliance.text).filter(Boolean).sort());
    return ["All", ...Array.from(uniqueCompliance)];
  }, [sortedAndFilteredDPPs]);

  const categoryOptionsForFilter = useMemo(() => {
    return ["All", ...availableCategories];
  }, [availableCategories]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold">Product Management</h1>
        {canAddProducts && (
          <Link href="/products/new" passHref>
            <Button variant="secondary">
              <PlusCircle className="mr-2 h-5 w-5" />
              Add New Product
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard title="Total Products" value={metrics.totalDPPs} icon={PackageIcon} />
        <MetricCard title="Active Products" value={metrics.metrics?.active || 0} icon={CheckCircle2} /> {/* Corrected to use metrics from hook */}
        <MetricCard title="Draft Products" value={metrics.metrics?.draft || 0} icon={Edit3} /> {/* Corrected */}
        <MetricCard title="Compliance Issues" value={metrics.metrics?.issues || 0} trendDirection={(metrics.metrics?.issues || 0) > 0 ? "up" : "neutral"} /> {/* Corrected */}
        <MetricCard title="Avg. DPP Completeness" value={metrics.averageCompleteness} icon={PieChart} />
      </div>

      <ProductManagementFiltersComponent
        filters={filters}
        onFilterChange={handleFiltersChange}
        statusOptions={statusOptions}
        complianceOptions={complianceOptions}
        categoryOptions={categoryOptionsForFilter}
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Product Inventory</CardTitle>
          <CardDescription>Manage and track all products in your system and their Digital Product Passports. Click headers to sort.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Image</TableHead>
                <SortableTableHead columnKey="id" title="ID" onSort={handleSort as (key: ProductSortableKeys) => void} sortConfig={sortConfig as ProductSortConfig} />
                <SortableTableHead columnKey="productName" title="Name" onSort={handleSort as (key: ProductSortableKeys) => void} sortConfig={sortConfig as ProductSortConfig} />
                <SortableTableHead columnKey="manufacturer.name" title="Manufacturer" onSort={handleSort as (key: ProductSortableKeys) => void} sortConfig={sortConfig as ProductSortConfig} />
                <SortableTableHead columnKey="category" title="Category" onSort={handleSort as (key: ProductSortableKeys) => void} sortConfig={sortConfig as ProductSortConfig} />
                <SortableTableHead columnKey="metadata.status" title="Status" onSort={handleSort as (key: ProductSortableKeys) => void} sortConfig={sortConfig as ProductSortConfig} />
                <SortableTableHead columnKey="overallCompliance" title="Compliance" onSort={handleSort as (key: ProductSortableKeys) => void} sortConfig={sortConfig as ProductSortConfig} />
                <SortableTableHead columnKey="metadata.onChainStatus" title="On-Chain Status" onSort={handleSort as (key: ProductSortableKeys) => void} sortConfig={sortConfig as ProductSortConfig} />
                <SortableTableHead columnKey="completenessScore" title="Completeness" onSort={handleSort as (key: ProductSortableKeys) => void} sortConfig={sortConfig as ProductSortConfig} className="w-28" />
                <SortableTableHead columnKey="metadata.last_updated" title="Last Updated" onSort={handleSort as (key: ProductSortableKeys) => void} sortConfig={sortConfig as ProductSortConfig} />
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredDPPs.map((product) => (
                <ProductListRow
                    key={product.id}
                    product={product}
                    completenessData={product.completeness}
                    currentRole={currentRole}
                    onDeleteProduct={() => openDeleteConfirmDialog(product)} 
                />
              ))}
               {sortedAndFilteredDPPs.length === 0 && (
                <TableRow><TableCell colSpan={11} className="text-center text-muted-foreground py-8">No products found matching your filters.</TableCell></TableRow>
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will archive product "{productToDeleteForDialog?.productName || productToDeleteId}". 
              Archived products can be viewed by adjusting filters.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Archive Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
