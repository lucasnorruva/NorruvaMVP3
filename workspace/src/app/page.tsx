
"use client"; // This page now needs client-side interactivity for the role selector

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users } from 'lucide-react'; // Added Users icon
import { Logo } from '@/components/icons/Logo';
import { useState, useEffect } from 'react'; // Added useState and useEffect
import { useRouter } from 'next/navigation'; // Added useRouter
import { useRole, type UserRole } from '@/contexts/RoleContext'; // Import useRole and UserRole
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

export default function HomePage() {
  const router = useRouter();
  const { availableRoles, setCurrentRole: setRoleInContext } = useRole(); // Get available roles from context
  const [selectedRole, setSelectedRole] = useState<UserRole>(availableRoles[0] || 'admin'); // Default to first available role or admin

  const handleRoleSelectAndNavigate = () => {
    if (selectedRole) {
      setRoleInContext(selectedRole); // Update context before navigating
      router.push(`/${selectedRole}-dashboard`);
    }
  };
  
  // Update selectedRole if availableRoles changes and current selectedRole is no longer valid
  useEffect(() => {
    if (!availableRoles.includes(selectedRole)) {
      setSelectedRole(availableRoles[0] || 'admin');
    }
  }, [availableRoles, selectedRole]);


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

      <div className="mb-8 w-full max-w-xs sm:max-w-sm md:max-w-md">
        <Label htmlFor="role-selector-homepage" className="text-md font-medium text-foreground/90 mb-2 flex items-center justify-center">
          <Users className="mr-2 h-5 w-5 text-primary"/> Select Your Role to Proceed:
        </Label>
        <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
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
    
