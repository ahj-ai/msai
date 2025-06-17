'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoggedInDashboard from '@/components/logged-in-dashboard';

// This is the static dashboard content that shows when not logged in
import { Dashboard } from "@/components/dashboard";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { SubscriptionBanner } from '@/components/subscription-banner';

function RedirectToHome() {
  const router = useRouter();
  useEffect(() => {
    router.push('/');
  }, [router]);
  return null;
}

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  // Show loading state while auth is being checked
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  // If user is not signed in, show the static dashboard
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Dashboard />
        </main>
        <Footer />
      </div>
    );
  }

  // Show the logged-in dashboard for authenticated users
  return (
    <>
      <SignedIn>
        <div className="flex flex-col">
          <LoggedInDashboard />
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToHome />
      </SignedOut>
    </>
  );
}
