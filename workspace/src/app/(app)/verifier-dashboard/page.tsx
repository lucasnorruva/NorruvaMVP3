
"use client";
import { useEffect } from 'react';
import { useRole } from '@/contexts/RoleContext';
import { VerifierDashboard as VerifierDashboardContent } from "@/components/dashboard/VerifierDashboard";

export default function VerifierDashboardPage() {
  const { setCurrentRole } = useRole();

  useEffect(() => {
    setCurrentRole('verifier');
  }, [setCurrentRole]);
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold">
          Verifier Dashboard
        </h1>
        {/* Add verifier-specific actions here if needed */}
      </div>
      <VerifierDashboardContent />
    </div>
  );
}
    