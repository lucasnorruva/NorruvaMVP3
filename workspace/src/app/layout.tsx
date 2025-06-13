
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { RoleProvider } from '@/contexts/RoleContext';
import { SkipToContent } from '@/components/layout/SkipToContent'
// ServiceWorkerRegister import is no longer strictly needed if it does nothing,
// but keeping it won't harm if it's neutralized.
// import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: 'Norruva Digital Product Passport',
  description: 'Secure and Compliant Product Data Management with AI-Powered Insights.',
  // Manifest link removed
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
        {/* PWA related tags removed:
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#1A202C" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Norruva DPP" />
        */}
      </head>
      <body className="font-body antialiased">
        <SkipToContent />
        {/* <ServiceWorkerRegister /> ServiceWorkerRegister component usage removed/commented */}
        <RoleProvider>
          {children}
        </RoleProvider>
        <Toaster />
      </body>
    </html>
  );
}

