
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users } from 'lucide-react';
import { Logo } from '@/components/icons/Logo';
import { useRole, type UserRole } from '@/contexts/RoleContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const HOMEPAGE_SELECTED_ROLE_KEY = 'norruvaHomepageSelectedRole';

export default function HomePage() {
  const router = useRouter();
  const { currentRole: roleFromContext, setCurrentRole: setRoleInContext, availableRoles } = useRole();
  
  const [selectedRole, setSelectedRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      const storedRole = localStorage.getItem(HOMEPAGE_SELECTED_ROLE_KEY);
      if (storedRole && availableRoles.includes(storedRole as UserRole)) {
        return storedRole as UserRole;
      }
    }
    if (roleFromContext && availableRoles.includes(roleFromContext)) {
      return roleFromContext;
    }
    return availableRoles.length > 0 ? availableRoles[0] : 'admin';
  });

  useEffect(() => {
    if (roleFromContext && availableRoles.includes(roleFromContext) && roleFromContext !== selectedRole) {
      setSelectedRole(roleFromContext);
    }
  }, [roleFromContext, availableRoles, selectedRole]);

  const handleRoleChange = (newRole: UserRole) => {
    setSelectedRole(newRole);
    if (typeof window !== 'undefined') {
      localStorage.setItem(HOMEPAGE_SELECTED_ROLE_KEY, newRole);
    }
  };

  const handleRoleSelectAndNavigate = () => {
    if (selectedRole) {
      setRoleInContext(selectedRole); 
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

      {availableRoles.length > 0 ? (
        <div className="mb-8 w-full max-w-xs">
          <Label htmlFor="role-selector-homepage" className="mb-2 text-sm font-medium text-muted-foreground flex items-center justify-center">
            <Users className="mr-2 h-4 w-4" /> Select Your Role
          </Label>
          <Select value={selectedRole} onValueChange={handleRoleChange}>
            <SelectTrigger id="role-selector-homepage" className="w-full h-11 text-base">
              <SelectValue placeholder="Select your role..." />
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
      ) : (
        <Alert variant="destructive" className="max-w-xs mb-8">
            <Info className="h-4 w-4" />
            <AlertTitle>Role Context Error</AlertTitle>
            <AlertDescription>Available roles not loaded. Please check RoleProvider.</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-6">
        <Button 
          size="lg" 
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
          onClick={handleRoleSelectAndNavigate}
          disabled={!selectedRole}
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
