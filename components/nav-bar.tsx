'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import MathStackLogo from './MathStackLogo';

interface NavBarProps {
  children?: React.ReactNode;
}

export default function NavBar({ children }: NavBarProps) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md fixed w-full z-50 border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <MathStackLogo />
            </Link>
          </div>

          {/* Main Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Signed In Navigation */}
            <SignedIn>
              <Link 
                href="/dashboard" 
                className={`text-gray-700 hover:text-[#6C63FF] transition-colors px-2 py-1.5 rounded-md ${
                  isActive('/dashboard') ? 'text-[#6C63FF] font-medium' : ''
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/brainiac" 
                className={`text-gray-700 hover:text-[#6C63FF] transition-colors px-2 py-1.5 rounded-md ${
                  isActive('/brainiac') || pathname?.startsWith('/brainiac') ? 'text-[#6C63FF] font-medium' : ''
                }`}
              >
                Brainiac
              </Link>
              <Link 
                href="/problem-lab" 
                className={`text-gray-700 hover:text-[#6C63FF] transition-colors px-2 py-1.5 rounded-md ${
                  isActive('/problem-lab') || pathname?.startsWith('/problem-lab') ? 'text-[#6C63FF] font-medium' : ''
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
                    isActive(href) ? 'text-[#6C63FF] font-medium' : ''
                  }`}
                >
                  {label}
                </Link>
              ))}
            </SignedOut>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <SignedIn>
              <Link href="/pricing" className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-full hover:opacity-90 transition-opacity shadow-md hover:shadow-lg">
                Upgrade
              </Link>
            </SignedIn>
            {children}
          </div>
        </div>
      </div>
    </nav>
  );
} 