
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/contexts/RoleContext';
import { Loader2 } from 'lucide-react';

// This page now acts as a redirector to the role-specific dashboard.
export default function DashboardRedirectPage() {
  const router = useRouter();
  const { currentRole, availableRoles } = useRole();

  useEffect(() => {
    if (currentRole && availableRoles.includes(currentRole)) {
      router.replace(`/${currentRole}-dashboard`);
    } else if (availableRoles.length > 0) {
      // Fallback to the first available role's dashboard if currentRole is somehow invalid
      // Or default to admin if no context yet (e.g. on first load before context might be set by header)
      const defaultRoleForRedirect = currentRole && availableRoles.includes(currentRole) ? currentRole : 'admin';
      router.replace(`/${defaultRoleForRedirect}-dashboard`);
    }
    // If no roles or currentRole is not set, it might briefly show loading or stay here.
    // A more robust solution might involve a global state for initial role loading.
  }, [currentRole, router, availableRoles]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-6">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-muted-foreground">Redirecting to your dashboard...</p>
    </div>
  );
}
    