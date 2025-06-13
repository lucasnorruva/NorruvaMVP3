
"use client";
import { useEffect } from 'react';
import { useRole } from '@/contexts/RoleContext';
import { ManufacturerDashboard as ManufacturerDashboardContent } from "@/components/dashboard/ManufacturerDashboard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function ManufacturerDashboardPage() {
  const { setCurrentRole } = useRole();

  useEffect(() => {
    setCurrentRole('manufacturer');
  }, [setCurrentRole]);

  return (
     <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold">
          Manufacturer Dashboard
        </h1>
        <Button asChild variant="secondary">
          <Link href="/products/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Product
          </Link>
        </Button>
      </div>
      <ManufacturerDashboardContent />
    </div>
  );
}
    