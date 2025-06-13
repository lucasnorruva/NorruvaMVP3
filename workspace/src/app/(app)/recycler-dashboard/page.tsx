
"use client";
import { useEffect } from 'react';
import { useRole } from '@/contexts/RoleContext';
import { RecyclerDashboard as RecyclerDashboardContent } from "@/components/dashboard/RecyclerDashboard";

export default function RecyclerDashboardPage() {
  const { setCurrentRole } = useRole();

  useEffect(() => {
    setCurrentRole('recycler');
  }, [setCurrentRole]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold">
          Recycler Dashboard
        </h1>
        {/* Add recycler-specific actions here if needed */}
      </div>
      <RecyclerDashboardContent />
    </div>
  );
}
    