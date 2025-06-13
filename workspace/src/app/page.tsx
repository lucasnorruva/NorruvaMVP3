
"use client"; 

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, UserCircle2 } from 'lucide-react';
import { Logo } from '@/components/icons/Logo';
import { useRole, type UserRole } from '@/contexts/RoleContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

const HOMEPAGE_ROLE_STORAGE_KEY = 'norruvaHomepageSelectedRole';

export default function HomePage() {
  const router = useRouter();
  const { currentRole: roleFromContext, setCurrentRole: setRoleInContext, availableRoles } = useRole();
  
  // Initialize selectedRole: try localStorage, then context, then first available, then default
  const [selectedRole, setSelectedRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      const storedRole = localStorage.getItem(HOMEPAGE_ROLE_STORAGE_KEY) as UserRole | null;
      if (storedRole && availableRoles.includes(storedRole)) {
        return storedRole;
      }
    }
    if (roleFromContext && availableRoles.includes(roleFromContext)) {
      return roleFromContext;
    }
    return availableRoles.length > 0 ? availableRoles[0] : 'admin';
  });

  // Effect to update local storage when selectedRole changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(HOMEPAGE_ROLE_STORAGE_KEY, selectedRole);
    }
  }, [selectedRole]);

  // Effect to synchronize with context if it changes (e.g., due to header interaction)
  useEffect(() => {
    if (roleFromContext && availableRoles.includes(roleFromContext) && roleFromContext !== selectedRole) {
      setSelectedRole(roleFromContext);
    }
  }, [roleFromContext, availableRoles, selectedRole]);

  const handleRoleSelectAndNavigate = () => {
    if (selectedRole) {
      setRoleInContext(selectedRole); // Update global context
      router.push(`/${selectedRole}-dashboard`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary p-6 text-center">
      <div className="mb-12">
        <Logo className="h-16 w-auto text-primary" />
      </div>
      <h1 className="font-headline text-5xl md:text-7xl font-bold mb-6 text-primary">
        Norruva Digital Product Passport
      </h1>
      <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto mb-10">
        Securely manage your product data, ensure EU compliance, and harness the power of AI for streamlined operations.
      </p>
      
      <div className="mb-8 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
        <Label htmlFor="role-selector-homepage" className="text-md font-medium text-foreground mb-2 block">
          Explore as a:
        </Label>
        {availableRoles.length > 0 ? (
          <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
            <SelectTrigger id="role-selector-homepage" className="w-full h-12 text-lg">
              <div className="flex items-center">
                <UserCircle2 className="h-5 w-5 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Select a Role" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {availableRoles.map((role) => (
                <SelectItem key={role} value={role} className="capitalize text-md py-2">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p className="text-muted-foreground">Loading roles...</p>
        )}
      </div>

      <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-6">
        <Button 
          size="lg" 
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto text-lg py-7 px-8"
          onClick={handleRoleSelectAndNavigate}
          disabled={!selectedRole}
        >
          Go to {selectedRole ? selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1) : ''} Dashboard
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
      
      <footer className="absolute bottom-8 text-muted-foreground text-sm">
        © {new Date().getFullYear()} Norruva. All rights reserved.
      </footer>
    </div>
  );
}
