
// --- File: DPPTable.tsx ---
// Description: Main table component for displaying Digital Product Passports in the Live Dashboard.
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ProcessedDPP, SortConfig, SortableKeys } from '@/hooks/useDPPLiveData'; // Import ProcessedDPP from the hook
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DPPTableRow } from "./DPPTableRow"; 

interface DPPTableProps {
  dpps: ProcessedDPP[]; // Use ProcessedDPP which includes completeness
  onSort: (key: SortableKeys) => void;
  sortConfig: SortConfig;
  onDeleteProduct?: (productId: string) => void;
  onViewAiSummary: (productId: string) => void;
}

const SortableHeader: React.FC<{
  columnKey: SortableKeys;
  title: string;
  onSort: (key: SortableKeys) => void;
  sortConfig: DPPTableProps['sortConfig'];
  className?: string;
}> = ({ columnKey, title, onSort, sortConfig, className }) => {
  const isSorted = sortConfig.key === columnKey;
  const Icon = isSorted ? (sortConfig.direction === 'ascending' ? ArrowUp : ArrowDown) : ChevronsUpDown;
  return (
    <TableHead className={cn("cursor-pointer hover:bg-muted/50 transition-colors", className)} onClick={() => onSort(columnKey)}>
      <div className="flex items-center gap-2">
        {title}
        <Icon className={cn("h-4 w-4", isSorted ? "text-primary" : "text-muted-foreground/50")} />
      </div>
    </TableHead>
  );
};

export const DPPTable: React.FC<DPPTableProps> = ({ dpps, onSort, sortConfig, onDeleteProduct, onViewAiSummary }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <SortableHeader columnKey="id" title="ID" onSort={onSort} sortConfig={sortConfig} />
          <SortableHeader columnKey="productName" title="Product Name" onSort={onSort} sortConfig={sortConfig} />
          <SortableHeader columnKey="manufacturer.name" title="Manufacturer" onSort={onSort} sortConfig={sortConfig} /> {/* Added Manufacturer */}
          <SortableHeader columnKey="category" title="Category" onSort={onSort} sortConfig={sortConfig} />
          <SortableHeader columnKey="metadata.status" title="Status" onSort={onSort} sortConfig={sortConfig} />
          <SortableHeader columnKey="overallCompliance" title="Overall Compliance" onSort={onSort} sortConfig={sortConfig} /> {/* Changed from TableHead */}
          <SortableHeader columnKey="ebsiVerification.status" title="EBSI Status" onSort={onSort} sortConfig={sortConfig} />
          <SortableHeader columnKey="completenessScore" title="Data Completeness" onSort={onSort} sortConfig={sortConfig} className="w-36" /> {/* Added Completeness */}
          <SortableHeader columnKey="metadata.last_updated" title="Last Updated" onSort={onSort} sortConfig={sortConfig} />
          <TableHead className="text-right w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dpps.length === 0 && (
          <TableRow>
            <TableCell colSpan={10} className="text-center text-muted-foreground py-8"> {/* Adjusted colSpan */}
              No Digital Product Passports match your current filters.
            </TableCell>
          </TableRow>
        )}
        {dpps.map((dpp) => (
          <DPPTableRow 
            key={dpp.id} 
            dpp={dpp} // dpp already includes completeness and overallCompliance from useDPPLiveData
            onDeleteProduct={onDeleteProduct}
            onViewAiSummary={onViewAiSummary}
          />
        ))}
      </TableBody>
    </Table>
  );
};
