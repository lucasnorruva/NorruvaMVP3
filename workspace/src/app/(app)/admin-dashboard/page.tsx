
"use client";

import { useEffect } from 'react';
import { useRole } from '@/contexts/RoleContext';
import { AdminDashboardOverview } from "@/components/dashboard/AdminDashboardOverview";
import { AdminQuickActions } from "@/components/dashboard/AdminQuickActions";
import { PlatformHealthStatsCard } from "@/components/dashboard/PlatformHealthStatsCard";
import AdminProductsAttentionCard from "@/components/dashboard/AdminProductsAttentionCard";
import AdminDataManagementKpisCard from "@/components/dashboard/AdminDataManagementKpisCard";
import { RegulationUpdatesCard } from "@/components/dashboard/RegulationUpdatesCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // For activity card

export default function AdminDashboardPage() {
  const { setCurrentRole } = useRole();

  useEffect(() => {
    setCurrentRole('admin');
  }, [setCurrentRole]);

  return (
    <div className="space-y-8">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold">
          Admin Dashboard
        </h1>
        <Button asChild variant="default">
          <Link href="/products/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Platform Product Setup
          </Link>
        </Button>
      </div>
      <AdminDashboardOverview />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AdminQuickActions />
        <Card className="shadow-lg lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-headline">Recent Platform Activity</CardTitle>
            <CardDescription>Conceptual overview of system-wide updates.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm max-h-72 overflow-y-auto">
              {[
                {text: "New Manufacturer 'SolarSolutions GmbH' onboarded.", time: "15m ago"},
                {text: "Product PROD005 status changed to 'Published'.", time: "45m ago"},
                {text: "AI Model 'DataExtractor v2.1' training completed.", time: "1h ago"},
              ].map(activity => (
                <li key={activity.text} className="flex items-center justify-between p-2.5 rounded-md hover:bg-muted/30 transition-colors border-b last:border-b-0">
                  <span className="text-foreground/90">{activity.text}</span>
                  <span className="text-muted-foreground text-xs whitespace-nowrap pl-2">{activity.time}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <PlatformHealthStatsCard />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <AdminProductsAttentionCard />
        <AdminDataManagementKpisCard />
      </div>
      <RegulationUpdatesCard />
    </div>
  );
}
    