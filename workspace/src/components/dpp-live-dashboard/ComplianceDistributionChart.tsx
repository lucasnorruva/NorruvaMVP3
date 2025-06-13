
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ShieldCheck } from 'lucide-react';
import { getStatusBadgeClasses } from '@/utils/dppDisplayUtils'; // For consistent colors

interface ComplianceData {
  name: string; // Compliance status text (e.g., "Fully Compliant", "Pending Review")
  value: number; // Count of DPPs with this status
}

interface ComplianceDistributionChartProps {
  data: ComplianceData[];
}

// Map compliance status text to a color from our theme or a reasonable default
const getComplianceColor = (statusName: string): string => {
  const statusClass = getStatusBadgeClasses(statusName);
  // Extract HSL from classes like "bg-green-100 text-green-700 border-green-300"
  // This is a simplified approach; a more robust way might be to map status directly to HSL vars.
  if (statusClass.includes('green')) return 'hsl(var(--chart-1))'; // Use primary chart color for compliant
  if (statusClass.includes('yellow') || statusClass.includes('orange')) return 'hsl(var(--chart-4))'; // Warning/Orange for pending
  if (statusClass.includes('red')) return 'hsl(var(--destructive))'; // Destructive for non-compliant
  if (statusClass.includes('blue')) return 'hsl(var(--chart-3))'; // Info/Purple for N/A or No Data
  return 'hsl(var(--muted-foreground))'; // Default grey
};

export const ComplianceDistributionChart: React.FC<ComplianceDistributionChartProps> = ({ data }) => {
   if (!data || data.length === 0) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <ShieldCheck className="mr-2 h-5 w-5 text-primary" />
            Compliance Status Distribution
          </CardTitle>
          <CardDescription>Breakdown of DPPs by their overall compliance status.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          No compliance data available to display.
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <ShieldCheck className="mr-2 h-5 w-5 text-primary" />
          Compliance Status Distribution
        </CardTitle>
        <CardDescription>Breakdown of DPPs by their overall compliance status.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" style={{ fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis 
                dataKey="name" 
                type="category" 
                width={100} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} 
                interval={0}
            />
            <Tooltip 
                contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))', 
                    border: '1px solid hsl(var(--border))', 
                    borderRadius: 'var(--radius)',
                    color: 'hsl(var(--popover-foreground))'
                }}
            />
            <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} iconSize={10} />
            <Bar dataKey="value" name="DPP Count" radius={[0, 4, 4, 0]} barSize={15}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getComplianceColor(entry.name)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
