import type { Metadata, Viewport } from 'next'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { GeistSans, GeistMono } from 'geist/font'
import './globals.css'
import NavBar from '@/components/nav-bar'
import { Toaster } from '@/components/ui/toaster'

import { AuthProvider } from '@/lib/auth'
import Link from 'next/link'

const geistSans = GeistSans
const geistMono = GeistMono

// Define viewport separately from metadata
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#6C63FF',
}

export const metadata: Metadata = {
  title: 'MathStack AI - AI-Powered Math Learning Platform',
  description: 'Transform your math learning experience with AI-powered tools and personalized guidance.',
  keywords: ['math', 'AI', 'learning', 'education', 'mathematics', 'tutoring', 'online learning'],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'MathStack AI - AI-Powered Math Learning Platform',
    description: 'Transform your math learning experience with AI-powered tools and personalized guidance.',
    url: 'https://mathstackai.com',
    siteName: 'MathStack AI',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MathStack AI',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MathStack AI - AI-Powered Math Learning Platform',
    description: 'Transform your math learning experience with AI-powered tools and personalized guidance.',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        // Logo placement and image configuration
        layout: {
          logoPlacement: 'inside',
        },
        variables: {
          colorPrimary: '#6C63FF',
          colorTextOnPrimaryBackground: '#FFFFFF',
          colorBackground: '#FFFFFF',
          colorInputBackground: '#F9F9FF',
          colorInputText: '#333333',
        },
        elements: {
          formButtonPrimary: 'bg-[#6C63FF] hover:bg-[#5E60CE] transition-colors',
          card: 'shadow-lg border border-gray-100 p-6 pt-8', // Reduced top padding
          header: 'pb-4', // Reduced bottom padding in header area
          headerTitle: 'text-gray-900',
          headerSubtitle: 'text-gray-600',
          socialButtonsBlockButton: 'border-gray-200 hover:bg-gray-50',
          socialButtonsBlockButtonArrow: 'text-gray-700',
          socialButtonsBlockButtonText: 'text-gray-700',
          footerActionText: 'text-gray-600',
          footerActionLink: 'text-[#6C63FF] hover:text-[#5E60CE]',
          formFieldInput: 'border-gray-200 focus:border-[#6C63FF] focus:ring-1 focus:ring-[#6C63FF]',
          formFieldLabel: 'text-gray-700',
          dividerLine: 'bg-gray-200',
          dividerText: 'text-gray-500',
          // Make the logo larger and center it properly
          logoBox: 'w-40 h-40 mx-auto flex items-center justify-center', // Much larger size and centered
          logoImage: 'w-full h-full object-contain', // Make logo fill the container
        },
      }}
    >
      <html lang="en" className="scroll-smooth">
        <body className={`${geistSans.className} ${geistMono.className} antialiased bg-gray-50`}>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
                <NavBar />
                
                <main className="flex-grow pt-16">
                  {children}
                </main>
                <Toaster />
                
                <footer className="bg-white border-t border-gray-100 py-8 mt-12">
                  <div className="container mx-auto px-4 sm:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                      <div className="mb-4 md:mb-0">
                        <span className="text-xl font-bold bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] bg-clip-text text-transparent">
                          MathStackAI
                        </span>
                        <p className="text-gray-500 text-sm mt-1"> {new Date().getFullYear()} MathStack AI. All rights reserved.</p>
                      </div>
                      <div className="flex items-center space-x-6">
                        <Link href="/privacy" className="text-gray-500 hover:text-[#6C63FF] transition-colors text-sm">Privacy Policy</Link>
                        <span className="text-gray-300">•</span>
                        <Link href="/terms" className="text-gray-500 hover:text-[#6C63FF] transition-colors text-sm">Terms of Service</Link>
                      </div>
                    </div>
                  </div>
                </footer>
            </div>
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
