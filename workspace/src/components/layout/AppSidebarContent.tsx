
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
  BadgeCheck, // Changed from CheckSquare for Verifier
  History as HistoryIconLucide,
  ShoppingCart,
  PlusCircle,
  Users2,
  Landmark, 
  Palette, 
  Server, 
  DatabaseZap, 
  MessageSquare, 
  LifeBuoy,
  HardDrive,
  FileSearch, // Added for Verifier - DPPs for Verification
  ClipboardEdit, // Added for Verifier - Submit Report
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
  group?: string; 
  exactMatch?: boolean; 
}

const ALL_NAV_ITEMS: Record<UserRole, { primary: NavItem[], secondary: NavItem[] }> = {
  admin: {
    primary: [
      { href: "/dashboard", label: "Admin Dashboard", icon: LayoutDashboard, exactMatch: true },
      { href: "/dpp-live-dashboard", label: "Live DPPs Overview", icon: LineChart },
      { href: "/products", label: "Product Management", icon: Package },
      { href: "/suppliers", label: "Supplier Directory", icon: Users2 },
      { href: "/customs-dashboard", label: "Customs Tracker", icon: ClipboardList },
      { href: "/dpp-global-tracker-v2", label: "DPP Global View", icon: Globe2 },
      { href: "/sustainability", label: "Sustainability HQ", icon: FileText, exactMatch: true },
      { href: "/compliance/pathways", label: "Compliance Hub", icon: ShieldCheck },
      { href: "/blockchain", label: "Blockchain Console", icon: Fingerprint },
      { href: "/gdpr", label: "GDPR Center", icon: Landmark, exactMatch: true },
      { href: "/audit-log", label: "System Audit Log", icon: ListChecks, exactMatch: true },
      { href: "/settings/users", label: "User Management", icon: Users },
      { href: "/settings", label: "Platform Settings", icon: Settings, exactMatch: true },
    ],
    secondary: [
      { href: "/developer", label: "Developer Portal", icon: Code2 },
      { href: "/copilot", label: "AI Co-Pilot", icon: Bot, exactMatch: true },
    ],
  },
  manufacturer: {
    primary: [
      { href: "/dashboard", label: "Manufacturer Dashboard", icon: LayoutDashboard, exactMatch: true },
      { href: "/products", label: "My Products", icon: Package },
      { href: "/products/new", label: "Add New Product", icon: PlusCircle, exactMatch: true },
      { href: "/suppliers", label: "My Suppliers", icon: Users2 },
      { href: "/blockchain", label: "Manage Product Tokens/Anchors", icon: Fingerprint },
      { href: "/sustainability", label: "Sustainability Reports", icon: FileText, exactMatch: true },
      { href: "/compliance/pathways", label: "Compliance Guidance", icon: ShieldCheck },
      { href: "/dpp-global-tracker-v2", label: "Global Product View", icon: Globe2 },
    ],
    secondary: [
      { href: "/copilot", label: "AI Co-Pilot", icon: Bot, exactMatch: true },
      { href: "/settings", label: "My Profile", icon: Settings, exactMatch: true },
    ],
  },
  supplier: {
    primary: [
      { href: "/dashboard", label: "Supplier Dashboard", icon: LayoutDashboard, exactMatch: true },
      { href: "/products/new", label: "Submit Component/Material Data", icon: UploadCloud, exactMatch: true },
      { href: "/dpp-live-dashboard?suppliedBy=myOrg", label: "Products Using My Components", icon: Package },
      { href: "/dashboard#data-requests", label: "View Data Requests", icon: Inbox }, // Conceptual link
    ],
    secondary: [
      { href: "/copilot", label: "Compliance Co-Pilot", icon: Bot, exactMatch: true },
      { href: "/settings", label: "My Supplier Profile", icon: Settings, exactMatch: true },
    ],
  },
  retailer: {
    primary: [
      { href: "/dashboard", label: "Retailer Dashboard", icon: LayoutDashboard, exactMatch: true },
      { href: "/dpp-live-dashboard", label: "Browse Product Passports", icon: LineChart },
      { href: "/sustainability/compare", label: "Compare Product Sustainability", icon: BarChartHorizontal, exactMatch: true },
    ],
    secondary: [
      { href: "/copilot", label: "AI Product Assistant", icon: Bot, exactMatch: true },
      { href: "/settings", label: "My Retailer Profile", icon: Settings, exactMatch: true },
    ],
  },
  recycler: {
    primary: [
      { href: "/dashboard", label: "Recycler Dashboard", icon: LayoutDashboard, exactMatch: true },
      { href: "/dpp-live-dashboard?status=all&includeArchived=true", label: "Search All DPPs (Incl. EOL)", icon: LineChart },
      { href: "/dpp-live-dashboard?searchQuery=disassembly%20OR%20recycling%20instructions%20OR%20material%20composition&includeArchived=true", label: "Access EOL & Material Data", icon: HardDrive },
      { href: "/dashboard#report-recovery", label: "Report Recovered Materials", icon: RecycleIconLucide }, // Conceptual
    ],
    secondary: [
      { href: "/copilot", label: "EOL Co-Pilot", icon: Bot, exactMatch: true },
      { href: "/settings", label: "My Recycler Profile", icon: Settings, exactMatch: true },
    ],
  },
  verifier: {
    primary: [
      { href: "/dashboard", label: "Verifier Dashboard", icon: LayoutDashboard, exactMatch: true },
      { href: "/dpp-live-dashboard?status=pending_review&status=flagged", label: "DPPs for Verification", icon: FileSearch },
      { href: "/audit-log", label: "View Audit Trails", icon: HistoryIconLucide, exactMatch: true },
      { href: "/dashboard#submit-report", label: "Submit Verification Report", icon: ClipboardEdit }, // Conceptual
    ],
    secondary: [
      { href: "/copilot", label: "Compliance Co-Pilot", icon: Bot, exactMatch: true },
      { href: "/settings", label: "My Verifier Profile", icon: Settings, exactMatch: true },
    ],
  },
};


export default function AppSidebarContent() {
  const pathname = usePathname();
  const { state: sidebarState, isMobile } = useSidebar();
  const { currentRole } = useRole();

  const { primary: navItems, secondary: secondaryNavItems } = ALL_NAV_ITEMS[currentRole] || ALL_NAV_ITEMS.admin; 

  const commonButtonClass = (href: string, exactMatch?: boolean) => {
    let isActive: boolean;
    const basePath = href.split('?')[0]; // Ignore query params for matching

    if (exactMatch) {
      isActive = pathname === basePath;
    } else {
      isActive = pathname.startsWith(basePath);
      // Special case for /products to not be active if /products/new is active
      if (href === "/products" && pathname.startsWith("/products/new")) {
        isActive = false;
      }
      // Special case for /sustainability to not be active if /sustainability/compare is active
      if (href === "/sustainability" && pathname.startsWith("/sustainability/compare")) {
        isActive = false;
      }
      // Prevent /compliance/pathways from being active if on /copilot or /gdpr,
      // which might be relevant if these were sub-routes of compliance.
      // Given current top-level structure, this might be redundant but safe.
      if (href === "/compliance/pathways" && (pathname.startsWith("/copilot") || pathname.startsWith("/gdpr"))) {
        isActive = false;
      }
    }
    
    // If we are on the dashboard, only the dashboard link should be active.
    // This overrides other startsWith logic if not exactMatch
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
              <SidebarMenuItem key={item.label}> 
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
                  <SidebarMenuItem key={item.label}> 
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

