'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ProblemLabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F8F9FB]">
      <nav className="container mx-auto px-4 py-4">
        <Link href="/" passHref>
          <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to MathStackAI
          </Button>
        </Link>
      </nav>
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}

