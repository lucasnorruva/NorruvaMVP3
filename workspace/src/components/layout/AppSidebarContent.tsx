
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ScanLine,
  ShieldCheck,
  FileText,
  Settings,
  Bot,
  Code2,
  LineChart,
  ListChecks,
  BarChartHorizontal,
  ClipboardList,
  Globe2,
  Users,
  Fingerprint,
  Building,
  Recycle as RecycleIconLucide,
  UploadCloud,
  Inbox,
  BadgeCheck,
  History as HistoryIconLucide,
  ShoppingCart,
  PlusCircle,
  Users2,
  Landmark, // Example for GDPR
  Palette, // Example for Theme/Branding
  Server, // Example for System Health
  DatabaseZap, // Example for Data Management
  MessageSquare, // Example for Feedback/Support
  LifeBuoy, // Example for Help
} from "lucide-react";
import { Logo } from "@/components/icons/Logo";
import { SidebarHeader, SidebarContent, SidebarFooter } from "@/components/ui/sidebar/Sidebar";
import { SidebarMenu } from "@/components/ui/sidebar/SidebarMenu";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar/SidebarItem";
import { useSidebar } from "@/components/ui/sidebar/SidebarProvider";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useRole, type UserRole } from "@/contexts/RoleContext";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  group?: string; // To group items under a conceptual header if needed later
  exactMatch?: boolean; // For links like /dashboard where sub-paths shouldn't activate it
}

const ALL_NAV_ITEMS: Record<UserRole, { primary: NavItem[], secondary: NavItem[] }> = {
  admin: {
    primary: [
      { href: "/dashboard", label: "Admin Dashboard", icon: LayoutDashboard, exactMatch: true },
      { href: "/dpp-live-dashboard", label: "Live DPPs Overview", icon: LineChart },
      { href: "/products", label: "Product Management", icon: Package },
      { href: "/suppliers", label: "Supplier Directory", icon: Users2 },
      { href: "/sustainability", label: "Sustainability HQ", icon: Leaf, exactMatch: true },
      { href: "/compliance/pathways", label: "Compliance Hub", icon: ShieldCheck },
      { href: "/customs-dashboard", label: "Customs Tracker", icon: ClipboardList },
      { href: "/dpp-global-tracker-v2", label: "DPP Global View", icon: Globe2 },
      { href: "/blockchain", label: "Blockchain Console", icon: Fingerprint },
      { href: "/settings/users", label: "User Management", icon: Users },
    ],
    secondary: [
      { href: "/developer", label: "Developer Portal", icon: Code2 },
      { href: "/audit-log", label: "System Audit Log", icon: ListChecks },
      { href: "/settings", label: "Platform Settings", icon: Settings, exactMatch: true },
      { href: "/copilot", label: "AI Co-Pilot", icon: Bot },
      { href: "/gdpr", label: "GDPR Center", icon: Landmark },
    ],
  },
  manufacturer: {
    primary: [
      { href: "/dashboard", label: "Manufacturer Dashboard", icon: LayoutDashboard, exactMatch: true },
      { href: "/products", label: "My Products", icon: Package },
      { href: "/products/new", label: "Add New Product", icon: PlusCircle },
      { href: "/suppliers", label: "My Suppliers", icon: Users2 },
      { href: "/sustainability", label: "Sustainability Reports", icon: FileText, exactMatch: true },
      { href: "/compliance/pathways", label: "Compliance Guidance", icon: ShieldCheck },
      { href: "/dpp-global-tracker-v2", label: "Global Product View", icon: Globe2 },
    ],
    secondary: [
      { href: "/copilot", label: "AI Co-Pilot", icon: Bot },
      { href: "/settings", label: "My Profile", icon: Settings, exactMatch: true },
    ],
  },
  supplier: {
    primary: [
      { href: "/dashboard", label: "Supplier Dashboard", icon: LayoutDashboard, exactMatch: true },
      // Conceptual links for supplier specific tasks
      { href: "/dpp-live-dashboard?filter=my_supplied_components", label: "Products Using My Components", icon: Package }, // Placeholder filter
      { href: "/developer/docs/data-management-best-practices", label: "Data Submission Portal", icon: UploadCloud }, // Link to guide as placeholder
      { href: "/copilot", label: "Compliance Co-Pilot", icon: Bot },
    ],
    secondary: [
      { href: "/settings", label: "My Supplier Profile", icon: Settings, exactMatch: true },
    ],
  },
  retailer: {
    primary: [
      { href: "/dashboard", label: "Retailer Dashboard", icon: LayoutDashboard, exactMatch: true },
      { href: "/dpp-live-dashboard", label: "View Product DPPs", icon: LineChart },
      // Conceptual: { href: "/retailer/inventory-check", label: "Scan Inventory DPPs", icon: ScanLine },
      { href: "/sustainability/compare", label: "Compare Products", icon: BarChartHorizontal },
    ],
    secondary: [
      { href: "/copilot", label: "Product Info Co-Pilot", icon: Bot },
      { href: "/settings", label: "My Retailer Profile", icon: Settings, exactMatch: true },
    ],
  },
  recycler: {
    primary: [
      { href: "/dashboard", label: "Recycler Dashboard", icon: LayoutDashboard, exactMatch: true },
      { href: "/dpp-live-dashboard?status=all&includeArchived=true", label: "Search All DPPs (Incl. EOL)", icon: LineChart },
      // Conceptual: { href: "/recycler/scan-eol", label: "Scan EOL Product", icon: ScanLine },
      // Conceptual: { href: "/recycler/material-database", label: "Material Recovery DB", icon: DatabaseZap },
    ],
    secondary: [
      { href: "/copilot", label: "EOL Co-Pilot", icon: Bot },
      { href: "/settings", label: "My Recycler Profile", icon: Settings, exactMatch: true },
    ],
  },
  verifier: {
    primary: [
      { href: "/dashboard", label: "Verifier Dashboard", icon: LayoutDashboard, exactMatch: true },
      { href: "/dpp-live-dashboard?status=pending_review", label: "DPPs for Verification", icon: LineChart }, // Default to pending
      { href: "/audit-log", label: "View Audit Trails", icon: HistoryIconLucide },
      // Conceptual: { href: "/verifier/submit-report", label: "Submit Verification Report", icon: FileText },
    ],
    secondary: [
      { href: "/copilot", label: "Compliance Co-Pilot", icon: Bot },
      { href: "/settings", label: "My Verifier Profile", icon: Settings, exactMatch: true },
    ],
  },
};


export default function AppSidebarContent() {
  const pathname = usePathname();
  const { state: sidebarState, isMobile } = useSidebar();
  const { currentRole } = useRole();

  const { primary: navItems, secondary: secondaryNavItems } = ALL_NAV_ITEMS[currentRole] || ALL_NAV_ITEMS.admin; // Default to admin if role somehow undefined

  const commonButtonClass = (href: string, exactMatch?: boolean) => {
    let isActive: boolean;

    if (exactMatch) {
      isActive = pathname === href;
    } else {
      isActive = pathname.startsWith(href);
      // Special case for /products to not be active for /products/new
      if (href === "/products" && pathname.startsWith("/products/new")) {
        isActive = false;
      }
       // Special case for /sustainability to not be active for /sustainability/compare
      if (href === "/sustainability" && pathname.startsWith("/sustainability/compare")) {
        isActive = false;
      }
    }
    
    // If on /dashboard, only highlight exact /dashboard link
    if (pathname === "/dashboard" && href !== "/dashboard") {
        isActive = false;
    }


    const className = cn(
      "w-full text-sm",
      isActive
        ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-normal text-sidebar-foreground/80",
      sidebarState === 'collapsed' && !isMobile ? "justify-center" : "justify-start"
    );

    return { className, isActive };
  };

  const commonIconClass = cn("h-5 w-5", sidebarState === 'expanded' || isMobile ? "mr-3" : "mr-0");

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border h-auto py-4 flex flex-col items-start px-4">
        {(sidebarState === 'expanded' || isMobile) && (
          <>
            <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:opacity-80">
              <Logo className="h-8 w-auto" />
            </Link>
            <p className="text-xs text-sidebar-foreground/70 mt-1.5 ml-0.5">
              Verified Product Trust
            </p>
          </>
        )}
        {sidebarState === 'collapsed' && !isMobile && (
           <Link href="/dashboard" className="flex items-center justify-center w-full text-primary hover:opacity-80 py-1">
             <Logo className="h-7 w-auto" />
           </Link>
        )}
      </SidebarHeader>
      <SidebarContent className="flex-1 py-2">
        <SidebarMenu className="px-2 space-y-1">
          {navItems.map((item) => {
            const { className, isActive } = commonButtonClass(item.href, item.exactMatch);
            return (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} asChild>
                  <SidebarMenuButton
                    className={className}
                    tooltip={sidebarState === 'collapsed' && !isMobile ? item.label : undefined}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <item.icon className={commonIconClass} />
                    {(sidebarState === 'expanded' || isMobile) && item.label}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      {(secondaryNavItems && secondaryNavItems.length > 0) && (
        <>
          <Separator className="bg-sidebar-border my-2" />
          <SidebarFooter className="p-2 border-t-0">
            <SidebarMenu className="px-2 space-y-1">
              {secondaryNavItems.map((item) => {
                const { className, isActive } = commonButtonClass(item.href, item.exactMatch);
                return (
                  <SidebarMenuItem key={item.href}>
                    <Link href={item.href} asChild>
                      <SidebarMenuButton
                        className={className}
                        tooltip={sidebarState === 'collapsed' && !isMobile ? item.label : undefined}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <item.icon className={commonIconClass} />
                        {(sidebarState === 'expanded' || isMobile) && item.label}
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarFooter>
        </>
      )}
    </>
  );
}

