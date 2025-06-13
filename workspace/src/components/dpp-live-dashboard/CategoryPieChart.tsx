
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Package } from 'lucide-react';

interface CategoryData {
  name: string;
  value: number;
}

interface CategoryPieChartProps {
  data: CategoryData[];
}

// Enhanced color palette
const COLORS = [
  'hsl(var(--chart-1))', // Primary Blue
  'hsl(var(--chart-2))', // Teal
  'hsl(var(--chart-3))', // Purple
  'hsl(var(--chart-4))', // Orange
  'hsl(var(--chart-5))', // Cyan
  'hsl(var(--chart-6))', // Pink
  '#FFBB28', // Gold
  '#FF8042', // Coral
  '#00C49F', // Emerald
  '#A4DE6C', // Light Green
  '#8884D8', // Lavender
  '#82CA9D', // Seafoam Green
];

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <Package className="mr-2 h-5 w-5 text-primary" />
            DPPs by Category
          </CardTitle>
          <CardDescription>Distribution of Digital Product Passports across categories.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          No category data available to display.
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <Package className="mr-2 h-5 w-5 text-primary" />
          DPPs by Category
        </CardTitle>
        <CardDescription>Distribution of Digital Product Passports across categories.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
                contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))', 
                    border: '1px solid hsl(var(--border))', 
                    borderRadius: 'var(--radius)',
                    color: 'hsl(var(--popover-foreground))'
                }}
            />
            <Legend 
                wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                iconSize={10}
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
