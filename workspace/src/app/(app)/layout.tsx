
"use client"; 
import type { ReactNode } from 'react';
import React from 'react'; 
import { usePathname } from 'next/navigation'; 
import { SidebarProvider } from "@/components/ui/sidebar/SidebarProvider";
import { Sidebar, SidebarInset } from "@/components/ui/sidebar/Sidebar";
import AppHeader from "@/components/layout/AppHeader";
import AppSidebarContent from "@/components/layout/AppSidebarContent";
// RoleProvider is now in the root layout (src/app/layout.tsx)

// Runtime patch for asChild (keeping it as it was, might not be the issue)
if (typeof window !== 'undefined' && React.createElement) {
  type CreateElementFn = typeof React.createElement;
  type AnyComponent = React.ComponentType<Record<string, unknown>>;

  const originalCreateElement: CreateElementFn = React.createElement;

  const patchedCreateElement = (
    type: string | AnyComponent,
    props: Record<string, unknown> | null,
    ...children: ReactNode[]
  ): ReturnType<CreateElementFn> => {
    if (props && 'asChild' in props && typeof type === 'string') {
      const { asChild, ...cleanProps } = props;
      return originalCreateElement(type, cleanProps, ...children);
    }
    return originalCreateElement(type, props, ...children);
  };

  React.createElement = patchedCreateElement as unknown as CreateElementFn;
}


export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname(); 

  // Developer portal routes have a simpler layout (no main app sidebar/header)
  if (pathname.startsWith('/developer')) {
    return (
      <main id="main-content" className="flex-1 p-4 md:p-6 lg:p-8 bg-background text-foreground min-h-screen pt-16"> {/* Added pt-16 to avoid overlap with debug banner */}
        {children}
      </main>
    );
  }

  // Standard app layout for other routes inside (app)
  return (
    <div className="pt-12"> {/* Added pt-12 to push content below the debug banner */}
      <SidebarProvider defaultOpen={true}>
        <Sidebar variant="sidebar" collapsible="icon">
          <AppSidebarContent />
        </Sidebar>
        <SidebarInset>
          <AppHeader />
          <main id="main-content" className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
