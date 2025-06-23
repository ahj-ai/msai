'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, useClerk, SignInButton, SignUpButton, UserButton, SignOutButton } from '@clerk/nextjs';
import MathStackLogo from './MathStackLogo';
import { StacksDisplay } from '@/components/ui/stacks-display';
import { useSubscription } from '@/hooks/use-subscription';
import { ProBadge } from '@/components/ui/pro-badge';
import { Crown, Menu, X, LogOut } from 'lucide-react';

interface NavBarProps {
  children?: React.ReactNode;
}

// Component to conditionally render Pro badge or Upgrade button
function NavBarSubscriptionStatus() {
  const { isPro, isLoading, refresh } = useSubscription();
  const { openUserProfile } = useClerk();
  
  // Force refresh subscription status when component mounts
  useEffect(() => {
    refresh();
    
    // Set up an interval to periodically check subscription status
    // This is especially useful after completing a checkout
    const checkInterval = setInterval(() => {
      refresh();
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(checkInterval);
  }, [refresh]);
  
  if (isLoading) return (
    <div className="w-20 h-6 bg-gray-200 animate-pulse rounded-full"></div>
  );
  
  // Function to open Clerk's user profile modal
  const handleOpenSubscriptionManagement = () => {
    // Open Clerk's user profile modal - user can navigate to Billing tab
    openUserProfile();
  };
  
  if (isPro) {
    return (
      <div 
        onClick={handleOpenSubscriptionManagement} 
        className="cursor-pointer flex items-center gap-1.5"
      >
        <ProBadge 
          variant="default" 
          size="default" 
          className="flex items-center shadow-sm hover:shadow transition-shadow"
        />
      </div>
    );
  }
  
  return (
    <div className="flex items-center">
      <Link href="/pricing" className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] rounded-full hover:opacity-90 transition-opacity shadow-md hover:shadow-lg flex items-center gap-1.5">
        <Crown className="h-4 w-4" />
        <span>Upgrade</span>
      </Link>
    </div>
  );
}

export default function NavBar({ children }: NavBarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isActive = (path: string) => pathname === path;

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <nav className="bg-white/80 backdrop-blur-md fixed w-full z-50 border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <MathStackLogo />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Signed In Navigation */}
            <SignedIn>
              <Link 
                href="/dashboard" 
                className={`text-gray-700 hover:text-[#6C63FF] transition-colors px-2 py-1.5 rounded-md ${
                  isActive('/dashboard') ? 'text-[#6C63FF] font-semibold border-b-2 border-[#6C63FF]' : ''
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/brainiac" 
                className={`text-gray-700 hover:text-[#6C63FF] transition-colors px-2 py-1.5 rounded-md ${
                  isActive('/brainiac') || pathname?.startsWith('/brainiac') ? 'text-[#6C63FF] font-semibold border-b-2 border-[#6C63FF]' : ''
                }`}
              >
                Brainiac
              </Link>
              <Link 
                href="/problem-lab" 
                className={`text-gray-700 hover:text-[#6C63FF] transition-colors px-2 py-1.5 rounded-md ${
                  isActive('/problem-lab') || pathname?.startsWith('/problem-lab') ? 'text-[#6C63FF] font-semibold border-b-2 border-[#6C63FF]' : ''
                }`}
              >
                Problem Lab
              </Link>
            </SignedIn>

            {/* Signed Out Navigation */}
            <SignedOut>
              {/* Products Dropdown */}
              <div className="relative group">
                <button 
                  className={`flex items-center text-gray-700 hover:text-[#6C63FF] transition-colors focus:outline-none ${
                    isActive('/brainiac') || isActive('/problem-lab') ? 'text-[#6C63FF]' : ''
                  }`}
                  aria-haspopup="true"
                >
                  Products
                  <svg 
                    className="ml-1.5 w-4 h-4 text-gray-400 group-hover:text-[#6C63FF] transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-50 border border-gray-100">
                  <Link 
                    href="/brainiac" 
                    className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-[#6C63FF] transition-colors"
                  >
                    Brainiac
                  </Link>
                  <Link 
                    href="/problem-lab" 
                    className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-[#6C63FF] transition-colors"
                  >
                    Problem Lab
                  </Link>
                </div>
              </div>
              
              {/* Navigation Links */}
              {[
                { href: '/why-mathstack-ai', label: 'Why MathStack AI?' },
                { href: '/pricing', label: 'Pricing' },
              ].map(({ href, label }) => (
                <Link 
                  key={href}
                  href={href}
                  className={`text-gray-700 hover:text-[#6C63FF] transition-colors px-2 py-1.5 rounded-md ${
                    isActive(href) ? 'text-[#6C63FF] font-semibold border-b-2 border-[#6C63FF]' : ''
                  }`}
                >
                  {label}
                </Link>
              ))}
            </SignedOut>
          </div>

          {/* Mobile menu button and auth buttons */}
          <div className="flex items-center space-x-4">
            <SignedIn>
              <div className="hidden md:flex items-center space-x-4">
                <StacksDisplay />
                <NavBarSubscriptionStatus />
                <SignOutButton>
                  <button
                    className="flex items-center gap-1.5 text-gray-700 hover:text-[#6C63FF] transition-colors px-2 py-1.5 rounded-md"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </SignOutButton>
              </div>
              {/* Mobile hamburger menu for SignedIn users */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-700 hover:text-[#6C63FF] hover:bg-gray-100 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </SignedIn>
            {/* Mobile hamburger menu for SignedOut users */}
            <SignedOut>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-700 hover:text-[#6C63FF] hover:bg-gray-100 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </SignedOut>
            {/* Hide Sign In and Get Started buttons on mobile, show only on desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <SignedOut>
                <Link href="/sign-in" className="text-gray-700 font-medium hover:text-[#6C63FF] transition-colors">Sign In</Link>
                <Link href="/sign-up" className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] rounded-full hover:opacity-90 transition-opacity shadow-md hover:shadow-lg ml-2">Get Started</Link>
              </SignedOut>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden fixed inset-0 top-16 bg-white/95 backdrop-blur-sm z-[100] overflow-y-auto h-[calc(100vh-4rem)] shadow-lg transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="px-6 py-6 space-y-6 max-w-md mx-auto">
          {/* Mobile Menu Header with Close Button */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full text-gray-700 hover:text-[#6C63FF] hover:bg-gray-100/70 transition-colors"
              aria-label="Close mobile menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <hr className="border-gray-200" />
          {/* Mobile menu content, show different links for signed in/out */}
          <SignedIn>
            <div className="space-y-4 px-4 py-4 mb-6 border border-gray-200 rounded-xl bg-gray-50/50 shadow-sm">
              <div className="flex justify-center">
                <StacksDisplay />
              </div>
              <div className="flex justify-center">
                <NavBarSubscriptionStatus />
              </div>
            </div>
            <div className="space-y-2">
              <Link 
                href="/dashboard" 
                className={`flex items-center text-base font-medium py-3 px-4 rounded-lg transition-colors ${
                  isActive('/dashboard') 
                    ? 'text-[#6C63FF] bg-[#6C63FF]/10' 
                    : 'text-gray-700 hover:text-[#6C63FF] hover:bg-gray-50/80'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/brainiac" 
                className={`flex items-center text-base font-medium py-3 px-4 rounded-lg transition-colors ${
                  isActive('/brainiac') || pathname?.startsWith('/brainiac')
                    ? 'text-[#6C63FF] bg-[#6C63FF]/10' 
                    : 'text-gray-700 hover:text-[#6C63FF] hover:bg-gray-50/80'
                }`}
              >
                Brainiac
              </Link>
              <Link 
                href="/problem-lab" 
                className={`flex items-center text-base font-medium py-3 px-4 rounded-lg transition-colors ${
                  isActive('/problem-lab') || pathname?.startsWith('/problem-lab')
                    ? 'text-[#6C63FF] bg-[#6C63FF]/10' 
                    : 'text-gray-700 hover:text-[#6C63FF] hover:bg-gray-50/80'
                }`}
              >
                Problem Lab
              </Link>
              <SignOutButton>
                <button
                  className="flex items-center gap-2 w-full text-base font-medium py-3 px-4 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </SignOutButton>
            </div>
          </SignedIn>
          <SignedOut>
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-5">
                <h3 className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-3">Products</h3>
                <div className="space-y-1">
                  <Link 
                    href="/brainiac" 
                    className="flex items-center text-base py-2.5 px-3 rounded-lg text-gray-700 hover:text-[#6C63FF] hover:bg-gray-50/80 transition-colors font-medium"
                  >
                    Brainiac
                  </Link>
                  <Link 
                    href="/problem-lab" 
                    className="flex items-center text-base py-2.5 px-3 rounded-lg text-gray-700 hover:text-[#6C63FF] hover:bg-gray-50/80 transition-colors font-medium"
                  >
                    Problem Lab
                  </Link>
                </div>
              </div>
              <div className="space-y-1">
                <Link 
                  href="/why-mathstack-ai" 
                  className={`flex items-center text-base font-medium py-2.5 px-3 rounded-lg transition-colors ${
                    isActive('/why-mathstack-ai')
                      ? 'text-[#6C63FF] bg-[#6C63FF]/10' 
                      : 'text-gray-700 hover:text-[#6C63FF] hover:bg-gray-50/80'
                  }`}
                >
                  Why MathStack AI?
                </Link>
                <Link 
                  href="/pricing" 
                  className={`flex items-center text-base font-medium py-2.5 px-3 rounded-lg transition-colors ${
                    isActive('/pricing')
                      ? 'text-[#6C63FF] bg-[#6C63FF]/10' 
                      : 'text-gray-700 hover:text-[#6C63FF] hover:bg-gray-50/80'
                  }`}
                >
                  Pricing
                </Link>
              </div>
              <div className="pt-2 space-y-3 mt-4">
                <SignInButton mode="modal">
                  <button className="w-full flex justify-center items-center text-base font-medium py-2.5 px-4 rounded-lg text-[#6C63FF] border border-[#6C63FF] bg-white hover:bg-[#6C63FF]/5 transition-all">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="w-full flex justify-center items-center text-base font-medium py-2.5 px-4 rounded-lg text-white bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] hover:shadow-md hover:opacity-95 transition-all">
                    Get Started
                  </button>
                </SignUpButton>
              </div>
            </div>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}