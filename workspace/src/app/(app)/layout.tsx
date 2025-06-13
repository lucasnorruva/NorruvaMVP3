
"use client"; 
import type { ReactNode } from 'react';
import React from 'react'; 
import { usePathname } from 'next/navigation'; 

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname(); 
  const timestamp = new Date().toISOString();

  if (pathname.startsWith('/developer')) {
    return (
      <main id="main-content" className="flex-1 p-4 md:p-6 lg:p-8 bg-background text-foreground min-h-screen">
        <div style={{border: "3px dashed #0000FF", padding: "10px", backgroundColor: "#e0e0ff", margin: "10px"}}>
          (APP)/LAYOUT (DEVELOPER VIEW) - LOADED AT: {timestamp}
        </div>
        {children}
      </main>
    );
  }

  return (
    <div style={{border: "5px solid #FF8C00", padding: "20px", backgroundColor: "#FFF3E0", margin: "10px"}}>
      <div style={{backgroundColor: "#FFDAB9", padding: "10px", fontWeight: "bold", textAlign: "center", fontSize: "18px"}}>
        (APP)/LAYOUT MINIMAL DEBUG - LOADED AT: {timestamp}
      </div>
      <main id="main-content" className="flex-1 p-4 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
