"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
    <nav className="bg-gradient-to-b from-[#181024] via-[#22043a] to-[#1a0a2e]/95 backdrop-blur-sm fixed w-full z-50 border-b border-purple-900/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              MathStackAI
            </span>
          </Link>

          {/* Main Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Products Dropdown */}
            <div className="relative group">
              <button className={`flex items-center text-gray-300 hover:text-purple-400 transition-colors focus:outline-none ${(pathname ?? '').startsWith('/brainiac') || (pathname ?? '').startsWith('/problem-lab') ? 'text-purple-400' : ''}`}
                aria-haspopup="true">
                Products
                <svg className="ml-1 w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-40 bg-black border border-purple-900/40 rounded shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-50">
                <Link href="/brainiac" className="block px-4 py-2 text-gray-300 hover:bg-purple-900/30 hover:text-purple-400 transition-colors">Brainiac</Link>
                <Link href="/problem-lab" className="block px-4 py-2 text-gray-300 hover:bg-purple-900/30 hover:text-purple-400 transition-colors">Problem Lab</Link>
              </div>
            </div>
            {/* Other main links */}
            <Link 
              href="/why-mathstack-ai" 
              className={`text-gray-300 hover:text-purple-400 transition-colors ${(pathname ?? '') === '/why-mathstack-ai' ? 'text-purple-400' : ''}`}
            >
              Why MathStack AI?
            </Link>
            <Link 
              href="/pricing" 
              className={`text-gray-300 hover:text-purple-400 transition-colors ${(pathname ?? '') === '/pricing' ? 'text-purple-400' : ''}`}
            >
              Pricing
            </Link>
          </div>

          {/* Authentication Links - Desktop */}
          <div className="hidden md:flex items-center space-x-4 ml-8">
            <Link href="/login" className="text-gray-300 hover:text-purple-400 transition-colors">Log In</Link>
            <Link href="/signup">
              <Button 
                className="bg-purple-600 text-white hover:bg-purple-700 rounded-full px-6 py-2 font-semibold shadow-md transition-colors"
              >
                Sign Up
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link href="/login" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">Log In</Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-300 hover:text-purple-400 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-gradient-to-b from-[#181024]/98 via-[#22043a]/98 to-[#1a0a2e]/98 backdrop-blur-md z-40 overflow-y-auto">
          <div className="px-4 py-6 space-y-6">
            {/* Products Section */}
            <div className="border-b border-purple-900/30 pb-4">
              <h3 className="text-lg font-semibold text-purple-400 bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] bg-clip-text text-transparent mb-3">Products</h3>
              <div className="space-y-3 ml-2">
                <Link 
                  href="/brainiac" 
                  className="block text-base font-medium py-2 px-3 rounded-md text-gray-300 hover:text-purple-400 hover:bg-purple-900/20 transition-colors"
                >
                  Brainiac
                </Link>
                <Link 
                  href="/problem-lab" 
                  className="block text-base font-medium py-2 px-3 rounded-md text-gray-300 hover:text-purple-400 hover:bg-purple-900/20 transition-colors"
                >
                  Problem Lab
                </Link>
              </div>
            </div>
            
            <div className="space-y-3">
              <Link 
                href="/why-mathstack-ai" 
                className={`block text-lg font-medium py-2.5 px-3 rounded-lg transition-colors ${
                  pathname === '/why-mathstack-ai'
                    ? 'text-purple-400 bg-purple-900/20' 
                    : 'text-gray-300 hover:text-purple-400 hover:bg-purple-900/10'
                }`}
              >
                Why MathStack AI?
              </Link>
              <Link 
                href="/pricing" 
                className={`block text-lg font-medium py-2.5 px-3 rounded-lg transition-colors ${
                  pathname === '/pricing'
                    ? 'text-purple-400 bg-purple-900/20' 
                    : 'text-gray-300 hover:text-purple-400 hover:bg-purple-900/10'
                }`}
              >
                Pricing
              </Link>
            </div>
            
            {/* Mobile Sign Up CTA */}
            <div className="mt-6 pt-4 border-t border-purple-900/30">
              <Link href="/signup" className="block w-full">
                <Button 
                  className="w-full bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] text-white hover:opacity-90 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  Sign Up - It's Free!
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
