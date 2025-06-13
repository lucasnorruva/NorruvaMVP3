
"use client";
import { useEffect } from 'react';
import { useRole } from '@/contexts/RoleContext';
import { SupplierDashboard as SupplierDashboardContent } from "@/components/dashboard/SupplierDashboard";

export default function SupplierDashboardPage() {
  const { setCurrentRole } = useRole();

  useEffect(() => {
    setCurrentRole('supplier');
  }, [setCurrentRole]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold">
          Supplier Dashboard
        </h1>
        {/* Add supplier-specific actions here if needed */}
      </div>
      <SupplierDashboardContent />
    </div>
  );
}
    