
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { RoleProvider } from '@/contexts/RoleContext'; // Import RoleProvider
import { SkipToContent } from '@/components/layout/SkipToContent'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: 'Norruva Digital Product Passport',
  description: 'Secure and Compliant Product Data Management with AI-Powered Insights.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
        />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1A202C" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Norruva DPP" />
      </head>
      <body className="font-body antialiased">
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', backgroundColor: 'red', color: 'white', padding: '10px', zIndex: 99999, textAlign: 'center', fontWeight: 'bold', fontSize: '1.2em' }}>
          ROOT LAYOUT DEBUG BANNER - LOADED AT: {new Date().toLocaleTimeString()} - IF YOU SEE THIS, LAYOUT.TSX IS UPDATING.
        </div>
        <SkipToContent />
        <ServiceWorkerRegister />
        <RoleProvider> {/* RoleProvider now wraps all children at the root level */}
          {children}
        </RoleProvider>
        <Toaster />
      </body>
    </html>
  );
}
