
"use client"; 

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users } from 'lucide-react';
import { Logo } from '@/components/icons/Logo';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole, type UserRole } from '@/contexts/RoleContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { availableRoles, setCurrentRole: setRoleInContext, currentRole: roleFromContext } = useRole();
  
  // Robust initialization for selectedRole
  const [selectedRole, setSelectedRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') { // Ensure localStorage access is client-side only
        const persistedRole = localStorage.getItem('norruva-selected-role-homepage') as UserRole | null;
        if (persistedRole && availableRoles.includes(persistedRole)) {
            return persistedRole;
        }
    }
    if (roleFromContext && availableRoles.includes(roleFromContext)) {
      return roleFromContext;
    }
    return availableRoles.length > 0 ? availableRoles[0] : 'admin'; // Default
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Component has mounted client-side
  }, []);

  // Synchronize local selectedRole with context role if context changes after mount
  useEffect(() => {
    if (isClient && roleFromContext && availableRoles.includes(roleFromContext) && roleFromContext !== selectedRole) {
      setSelectedRole(roleFromContext);
    }
  }, [roleFromContext, availableRoles, selectedRole, isClient]);

  // Persist selectedRole to localStorage
  useEffect(() => {
    if (isClient && selectedRole) {
        localStorage.setItem('norruva-selected-role-homepage', selectedRole);
    }
  }, [selectedRole, isClient]);


  const handleRoleSelectAndNavigate = () => {
    if (selectedRole) {
      setRoleInContext(selectedRole); 
      router.push(`/${selectedRole}-dashboard`); 
    }
  };

  // Debug information
  const debugInfo = isClient ? `Available Roles: ${availableRoles.join(', ')} | Selected Role: ${selectedRole} | Context Role: ${roleFromContext}` : "Waiting for client...";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary p-6 text-center">
      {/* VERY OBVIOUS DEBUG MESSAGE */}
      <div style={{ position: 'fixed', top: '10px', left: '10px', backgroundColor: 'yellow', padding: '10px', border: '2px solid red', zIndex: 9999 }}>
        DEBUG: Homepage Rendered at {new Date().toLocaleTimeString()}. Role Selector SHOULD be visible below.
        <br />
        {debugInfo}
      </div>

      <div className="mb-12">
        <Logo className="h-16 w-auto text-primary" />
      </div>

      <h1 className="font-headline text-5xl md:text-7xl font-bold mb-6 text-primary">
        Norruva Digital Product Passport
      </h1>

      <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto mb-10">
        Securely manage your product data, ensure EU compliance, and harness the power of AI for streamlined operations.
      </p>

      {isClient && availableRoles.length > 0 && (
        <div className="mb-8 w-full max-w-xs sm:max-w-sm md:max-w-md">
          <Label htmlFor="role-selector-homepage" className="text-md font-medium text-foreground/90 mb-2 flex items-center justify-center">
            <Users className="mr-2 h-5 w-5 text-primary"/> Select Your Role to Proceed:
          </Label>
          <Select 
            value={selectedRole} 
            onValueChange={(value) => setSelectedRole(value as UserRole)}
          >
            <SelectTrigger id="role-selector-homepage" className="w-full h-11 bg-card shadow-sm text-base">
              <SelectValue placeholder="Select a role..." />
            </SelectTrigger>
            <SelectContent>
              {availableRoles.map(role => (
                <SelectItem key={role} value={role} className="capitalize text-base py-2">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {isClient && availableRoles.length === 0 && (
         <Alert variant="destructive" className="mb-8 w-full max-w-md">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Role Configuration Issue</AlertTitle>
            <AlertDescription>
              No available roles found in context. Please check RoleProvider.
            </AlertDescription>
          </Alert>
      )}


      <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-6">
        <Button
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
          onClick={handleRoleSelectAndNavigate}
          disabled={!selectedRole || availableRoles.length === 0} 
        >
          Go to {selectedRole ? (selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)) : ''} Dashboard
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <Button variant="outline" size="lg" className="w-full sm:w-auto">
          Learn More
        </Button>
      </div>

      <footer className="absolute bottom-8 text-muted-foreground text-sm">
        © {new Date().getFullYear()} Norruva. All rights reserved.
      </footer>
    </div>
  );
}
