
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Logo } from '@/components/icons/Logo';

export default function HomePage() {
  // On the public home page, we'll default to the admin dashboard for now,
  // as this is a demo. In a real app with login, this would redirect 
  // to the user's specific role dashboard post-login, or a general welcome page.
  const defaultDashboardLink = "/admin-dashboard"; 

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
      <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-6">
        <Link href={defaultDashboardLink} passHref>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
            Go to Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
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
    