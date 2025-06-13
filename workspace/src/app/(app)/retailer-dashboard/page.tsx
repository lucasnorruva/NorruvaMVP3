
"use client";
import { useEffect } from 'react';
import { useRole } from '@/contexts/RoleContext';
import { RetailerDashboard as RetailerDashboardContent } from "@/components/dashboard/RetailerDashboard";

export default function RetailerDashboardPage() {
  const { setCurrentRole } = useRole();

  useEffect(() => {
    setCurrentRole('retailer');
  }, [setCurrentRole]);

  return (
     <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold">
          Retailer Dashboard
        </h1>
        {/* Add retailer-specific actions here if needed */}
      </div>
      <RetailerDashboardContent />
    </div>
  );
}
    