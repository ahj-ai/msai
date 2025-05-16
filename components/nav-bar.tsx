'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

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
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-wide bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] bg-clip-text text-transparent">
              MathStackAI
            </span>
          </Link>

          {/* Main Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
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
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {children}
          </div>
        </div>
      </div>
    </nav>
  );
} 