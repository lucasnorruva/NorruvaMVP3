
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { RoleProvider } from '@/contexts/RoleContext';
import { SkipToContent } from '@/components/layout/SkipToContent'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: 'Norruva DPP - ROOT LAYOUT DEBUG',
  description: 'Forcing update propagation check on root layout.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const timestamp = new Date().toISOString();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FF0000" />
        <style>{`
          #root-layout-debug-banner {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background-color: #FF0000 !important; /* Bright Red */
            color: white !important;
            padding: 10px;
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            z-index: 999999;
            border-bottom: 5px solid #FFFF00; /* Yellow border */
          }
        `}</style>
      </head>
      <body className="font-body antialiased">
        <div id="root-layout-debug-banner">
          ROOT LAYOUT DEBUG BANNER - LOADED AT: {timestamp} -- If you see this, layout.tsx is updating.
        </div>
        <div style={{ paddingTop: '70px' }}> {/* Add padding to push content below banner */}
          <SkipToContent />
          <ServiceWorkerRegister />
          <RoleProvider>
            {children}
          </RoleProvider>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
