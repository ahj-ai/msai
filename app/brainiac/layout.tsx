"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import type React from "react"

import { ParticleBackground } from "@/components/particle-background"

export default function BrainiacLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground lightMode={true} />
      <nav className="container mx-auto px-4 py-4 relative z-10">
        <Link href="/" passHref>
          <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to MathStackAI
          </Button>
        </Link>
      </nav>
      <div className="container mx-auto px-4 py-8 relative z-10">{children}</div>
    </div>
  )
}