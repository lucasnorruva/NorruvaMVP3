
// --- File: page.tsx (Customs & Compliance Dashboard) ---
// Description: Dashboard for customs officers and compliance managers to track products and alerts.
"use client";

import React, { useState, useEffect, useCallback } from 'react'; // Added React import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, AlertTriangle, ShieldCheck, Package, CheckCircle, Clock, Truck, Ship, Plane, ScanLine, FileText, CalendarDays, Anchor, Warehouse, ArrowUp, ArrowDown, MinusCircle, Eye } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useSearchParams } from 'next/navigation';
import { MOCK_TRANSIT_PRODUCTS, MOCK_CUSTOMS_ALERTS } from '@/data';
import type { TransitProduct, CustomsAlert, InspectionEvent } from '@/types/dpp'; // Import InspectionEvent
import { getStatusIcon, getStatusBadgeVariant, getStatusBadgeClasses } from "@/utils/dppDisplayUtils"; 
import SelectedProductCustomsInfoCard from '@/components/dpp-tracker/SelectedProductCustomsInfoCard'; 


const MetricCardWidget: React.FC<{title: string, value: string | number, icon: React.ElementType, description?: string, trend?: string, trendDirection?: 'up' | 'down' | 'neutral'}> = ({ title, value, icon: Icon, description, trend, trendDirection }) => {
  let TrendIconComponent = MinusCircle;
  let trendColor = "text-muted-foreground";

  if (trendDirection === "up") {
    TrendIconComponent = ArrowUp;
    trendColor = "text-success";
  } else if (trendDirection === "down") {
    TrendIconComponent = ArrowDown;
    trendColor = "text-danger";
  }

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
            {trend && (
              <p className={cn("text-xs mt-1 flex items-center", trendColor)}>
                <TrendIconComponent className="h-3.5 w-3.5 mr-1" />
                {trend}
              </p>
            )}
        </CardContent>
    </Card>
  );
};

// Conceptual function to generate mock inspection timeline
const generateMockInspectionTimelineForProduct = (product: TransitProduct): InspectionEvent[] => {
  const timeline: InspectionEvent[] = [];
  const now = new Date();
  const etaDate = new Date(product.eta);

  const addEvent = (baseTimestamp: Date, offsetDays: number, title: string, description: string, icon: React.ElementType, status: InspectionEvent['status'], badgeVariant?: InspectionEvent['badgeVariant']) => {
    const eventDate = new Date(baseTimestamp);
    eventDate.setDate(baseTimestamp.getDate() + offsetDays);
    timeline.push({
      id: `evt-${product.id}-${title.replace(/\s+/g, '')}-${Math.random().toString(36).substring(7)}`,
      icon,
      title,
      timestamp: eventDate.toISOString(),
      description,
      status,
      badgeVariant
    });
  };
  
  // 1. Departure from Origin
  addEvent(etaDate, -5, `Departure from ${product.origin.split(',')[1] || product.origin}`, `Shipment left origin country. Transport: ${product.transport}`, product.transport === "Ship" ? Ship : product.transport === "Truck" ? Truck : Plane, "Completed");

  // 2. Approaching EU Border (if applicable based on stage)
  if(product.stage.toLowerCase().includes("approaching")) {
    addEvent(etaDate, -1, `Approaching EU Border (${product.stage.split('(')[1]?.split(')')[0] || 'Entry Port'})`, `Shipment nearing EU customs territory.`, product.transport === "Ship" ? Ship : product.transport === "Truck" ? Truck : Plane, "In Progress");
  }
  
  // 3. Arrival at EU Border
  addEvent(etaDate, 0, `Arrival at EU Border (${product.stage.split('(')[1]?.split(')')[0] || 'Entry Port'})`, `Product arrived at EU entry point. Current Stage: ${product.stage}`, Anchor, product.stage.toLowerCase().includes("cleared") || product.stage.toLowerCase().includes("arrived") ? "Completed" : "In Progress");

  // 4. Initial Customs Scan & DPP Check
  addEvent(etaDate, 0, "Initial Customs Scan & DPP Check", `Automated scan. DPP Status: ${product.dppStatus}.`, ScanLine, "Completed");

  // 5. Documentation Review
  addEvent(etaDate, 0, "Documentation Review", `Import declarations and compliance documents checked.`, FileText, "Completed");

  // 6. Conditional Inspection
  if (product.dppStatus === 'Pending Review' || product.dppStatus === 'Non-Compliant' || product.id === "PROD789" /* Specific example product */) {
    addEvent(etaDate, 1, "Flagged for Physical Inspection", `Product batch selected for inspection. Reason: ${product.dppStatus === 'Non-Compliant' ? 'DPP Discrepancy' : product.dppStatus === 'Pending Review' ? 'Incomplete Data' : 'Random Check'}.`, AlertTriangle, "Action Required", "outline");
    addEvent(etaDate, 2, "Physical Inspection Complete", `Inspection results: ${product.dppStatus === 'Non-Compliant' ? 'Minor issues found, report filed.' : 'Passed.'}`, CheckCircle, "Completed", product.dppStatus === 'Non-Compliant' ? "destructive" : "default");
  }

  // 7. Customs Clearance
  const clearanceOffset = (product.dppStatus === 'Pending Review' || product.dppStatus === 'Non-Compliant' || product.id === "PROD789") ? 3 : 1;
  addEvent(etaDate, clearanceOffset, "Customs Clearance Granted", `Product cleared for entry into EU market.`, ShieldCheck, "Completed", "default");

  // 8. Released for Inland Transit
  addEvent(etaDate, clearanceOffset, `Released for Inland Transit to ${product.destination.split(',')[0]}`, `Released to logistics partner.`, Truck, "In Progress");
  
  // 9. Arrival at Destination
  addEvent(etaDate, clearanceOffset + 2, `Arrival at Destination Warehouse (${product.destination.split(',')[0]})`, `Expected delivery at destination.`, Warehouse, "Upcoming");
  
  timeline.sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  return timeline;
};


export default function CustomsDashboardPage() {
  const searchParams = useSearchParams();
  const countryParam = searchParams.get('country');
  const country = countryParam ? decodeURIComponent(countryParam) : null;
  const [selectedProductForTimeline, setSelectedProductForTimeline] = useState<TransitProduct | null>(null);
  const [dynamicInspectionTimeline, setDynamicInspectionTimeline] = useState<InspectionEvent[]>([]);

  const filteredProducts = country
    ? MOCK_TRANSIT_PRODUCTS.filter(p =>
        p.origin.toLowerCase().includes(country.toLowerCase()) ||
        p.destination.toLowerCase().includes(country.toLowerCase())
      )
    : MOCK_TRANSIT_PRODUCTS;

  const filteredAlerts = country
    ? MOCK_CUSTOMS_ALERTS.filter(alert => {
        const prod = MOCK_TRANSIT_PRODUCTS.find(p => p.id === alert.productId);
        return prod
          ? prod.origin.toLowerCase().includes(country.toLowerCase()) ||
              prod.destination.toLowerCase().includes(country.toLowerCase())
          : false;
      })
    : MOCK_CUSTOMS_ALERTS;

  const handleViewTimeline = useCallback((product: TransitProduct) => {
    setSelectedProductForTimeline(product);
    setDynamicInspectionTimeline(generateMockInspectionTimelineForProduct(product));
  }, []);

  useEffect(() => {
    // Optionally select the first product in the filtered list if none selected
    if (!selectedProductForTimeline && filteredProducts.length > 0) {
      // handleViewTimeline(filteredProducts[0]); // Uncomment to auto-select first product
    } else if (selectedProductForTimeline && !filteredProducts.find(p => p.id === selectedProductForTimeline.id)) {
      // If current selected product is no longer in filtered list, clear selection
      setSelectedProductForTimeline(null);
      setDynamicInspectionTimeline([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredProducts]); // Re-evaluate if filteredProducts change

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-semibold">Customs & Compliance Dashboard</h1>
      {country && (
        <p className="text-sm text-muted-foreground">
          Filtered by country: <Badge className="ml-1" variant="outline">{country}</Badge>
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCardWidget title="Shipments in Transit (EU)" value="132" icon={Truck} description="Active customs entries" trend="+5 from last hour" trendDirection="up" />
        <MetricCardWidget title="Products at Customs Checkpoints" value="27" icon={Anchor} description="Ports, Airports, Land Borders" trend="+3 new arrivals" trendDirection="up" />
        <MetricCardWidget title="Overall DPP Compliance Rate" value="92%" icon={ShieldCheck} description="For incoming goods" trend="-1% vs last week" trendDirection="down" />
        <MetricCardWidget title="Products Flagged for Inspection" value="5" icon={AlertTriangle} description="2 critical issues pending" trend="No change" trendDirection="neutral" />
      </div>

      {selectedProductForTimeline && (
          <SelectedProductCustomsInfoCard
            productTransitInfo={selectedProductForTimeline}
            alerts={MOCK_CUSTOMS_ALERTS.filter(a => a.productId === selectedProductForTimeline.id)}
            onDismiss={() => {
                setSelectedProductForTimeline(null);
                setDynamicInspectionTimeline([]);
            }}
          />
      )}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Package className="mr-2 h-5 w-5 text-primary"/>Products in Transit / At Customs</CardTitle>
          <CardDescription>Overview of products currently moving towards or within the EU customs territory. Click "View Timeline" for details.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Current Stage</TableHead>
                <TableHead>Transport</TableHead>
                <TableHead>Origin &rarr; Dest.</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead>DPP Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const etaDate = new Date(product.eta);
                const today = new Date();
                today.setHours(0, 0, 0, 0); 
                const isEtaPast = etaDate < today;
                const isEtaToday = etaDate.toDateString() === today.toDateString();
                
                const DppStatusIcon = getStatusIcon(product.dppStatus);
                const dppStatusBadgeVariant = getStatusBadgeVariant(product.dppStatus);
                const dppStatusClasses = getStatusBadgeClasses(product.dppStatus);
                const formattedDppStatus = product.dppStatus
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, char => char.toUpperCase());

                return (
                  <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.stage}</TableCell>
                    <TableCell className="capitalize flex items-center">
                      {product.transport === "Ship" && <Ship className="h-4 w-4 mr-1.5 text-blue-500" />}
                      {product.transport === "Truck" && <Truck className="h-4 w-4 mr-1.5 text-orange-500" />}
                      {product.transport === "Plane" && <Plane className="h-4 w-4 mr-1.5 text-purple-500" />}
                      {product.transport}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{product.origin} &rarr; {product.destination}</TableCell>
                    <TableCell>
                      {isEtaPast ? (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Overdue: {etaDate.toLocaleDateString()}
                        </Badge>
                      ) : isEtaToday ? (
                        <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-700 border-yellow-300">
                          <Clock className="mr-1 h-3 w-3" />
                          Due Today: {etaDate.toLocaleDateString()}
                        </Badge>
                      ) : (
                        etaDate.toLocaleDateString()
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={dppStatusBadgeVariant}
                        className={cn("text-xs capitalize", dppStatusClasses)}
                      >
                        {React.cloneElement(DppStatusIcon, {className: "mr-1 h-3 w-3"})}
                        {formattedDppStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewTimeline(product)}>
                        <Eye className="mr-1 h-4 w-4" /> Timeline
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="shadow-lg md:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <CalendarDays className="mr-2 h-5 w-5 text-primary"/>
              Customs Inspection Timeline {selectedProductForTimeline ? `for ${selectedProductForTimeline.name} (${selectedProductForTimeline.id})` : "(Select a Product)"}
            </CardTitle>
            <CardDescription>Chronological overview of a product's conceptual journey through customs.</CardDescription>
          </CardHeader>
          <CardContent className="pr-2">
            {selectedProductForTimeline ? (
              <ul className="space-y-3 max-h-[450px] overflow-y-auto">
                {dynamicInspectionTimeline.map((event) => {
                  let badgeColorClass = "bg-muted text-muted-foreground";
                  if (event.status === "Completed" && event.badgeVariant === "default") badgeColorClass = "bg-green-100 text-green-700 border-green-300";
                  else if (event.status === "Completed") badgeColorClass = "bg-green-100 text-green-700 border-green-300";
                  else if (event.status === "Action Required" || event.status === "Delayed") badgeColorClass = "bg-yellow-100 text-yellow-700 border-yellow-300";
                  else if (event.status === "In Progress") badgeColorClass = "bg-blue-100 text-blue-700 border-blue-300";
                  else if (event.status === "Upcoming") badgeColorClass = "bg-gray-100 text-gray-700 border-gray-300";
                  
                  return (
                    <li key={event.id} className="flex items-start space-x-3 p-3.5 border rounded-md bg-background hover:bg-muted/30 transition-colors shadow-sm">
                      <div className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center", badgeColorClass.split(' ')[0])}>
                        <event.icon className={cn("h-4 w-4", badgeColorClass.split(' ')[1])} />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-foreground">{event.title}</p>
                          {event.status && (
                             <Badge variant={event.badgeVariant || "secondary"} className={cn(badgeColorClass, "text-xs")}>
                               {event.status}
                             </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</p>
                        <p className="text-sm text-foreground/80 mt-1">{event.description}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-10">Select a product from the table above to view its detailed inspection timeline.</p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6 md:col-span-1">
            <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline flex items-center"><BarChart3 className="mr-2 h-5 w-5 text-primary"/>DPP Compliance Overview</CardTitle>
                <CardDescription>Breakdown of incoming products by DPP compliance status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                <div className="flex justify-between mb-1 text-sm">
                    <span className="text-foreground">Compliant DPPs</span>
                    <span className="font-semibold text-green-600">750 (85%)</span>
                </div>
                <Progress value={85} className="h-2.5 [&>div]:bg-green-500" aria-label="85% Compliant DPPs"/>
                </div>
                <div>
                <div className="flex justify-between mb-1 text-sm">
                    <span className="text-foreground">Pending Review/Data</span>
                    <span className="font-semibold text-yellow-600">80 (9%)</span>
                </div>
                <Progress value={9} className="h-2.5 [&>div]:bg-yellow-500" aria-label="9% Pending Review/Data"/>
                </div>
                <div>
                <div className="flex justify-between mb-1 text-sm">
                    <span className="text-foreground">Issues / Non-Compliant</span>
                    <span className="font-semibold text-red-600">50 (6%)</span>
                </div>
                <Progress value={6} className="h-2.5 [&>div]:bg-red-500" aria-label="6% Issues/Non-Compliant"/>
                </div>
                <p className="text-xs text-muted-foreground pt-2">Note: This is a static mock representation.</p>
            </CardContent>
            </Card>

            <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-destructive"/>
                    Customs Inspection Alerts
                    {filteredAlerts.length > 0 && (
                        <Badge variant="destructive" className="ml-2">
                            {filteredAlerts.length}
                        </Badge>
                    )}
                </CardTitle>
                <CardDescription>Products currently flagged or requiring attention at customs.</CardDescription>
            </CardHeader>
            <CardContent>
                {filteredAlerts.length > 0 ? (
                <ul className="space-y-3 max-h-[200px] overflow-y-auto">
                    {filteredAlerts.map((alert) => (
                    <li key={alert.id} className="p-3 border rounded-md bg-background hover:bg-muted/30">
                        <div className="flex justify-between items-start mb-1">
                            <p className="font-medium text-sm text-foreground">Product ID: {alert.productId}</p>
                            <Badge variant={alert.severity === "High" ? "destructive" : alert.severity === "Medium" ? "outline" : "secondary"} className={cn(
                                "text-xs",
                                alert.severity === "High" ? "bg-red-100 text-red-700 border-red-300" : "",
                                alert.severity === "Medium" ? "bg-yellow-100 text-yellow-700 border-yellow-300" : "",
                                alert.severity === "Low" ? "bg-blue-100 text-blue-700 border-blue-300" : ""
                            )}>
                                {alert.severity}
                            </Badge>
                        </div>
                        <p className="text-sm text-foreground/90">{alert.message}</p>
                        <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                           <span>{alert.timestamp}</span>
                           <span>Regulation: {alert.regulation}</span>
                        </div>
                    </li>
                    ))}
                </ul>
                ) : (
                <p className="text-sm text-muted-foreground">No active customs alerts.</p>
                )}
            </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
    
