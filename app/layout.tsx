import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from "@clerk/nextjs"
import { AuthProvider } from "@/lib/auth"
import NavBar from "@/components/nav-bar"
import { Footer } from "@/components/footer"

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MathStack AI',
  description: 'AI-Powered Math Learning Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <AuthProvider>
        <html lang="en">
          <body className={inter.className}>
            <NavBar />
            <main className="min-h-screen">{children}</main>
          </body>
        </html>
      </AuthProvider>
    </ClerkProvider>
  )
}

