"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import type React from "react"

import { ParticleBackground } from "@/components/particle-background"

export default function BrainiacLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      <ParticleBackground />
      <nav className="container mx-auto px-4 py-4 relative z-10">
        <Link href="/" passHref>
          <Button variant="ghost" className="text-purple-300 hover:text-purple-200">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to MathStackAI
          </Button>
        </Link>
      </nav>
      <div className="container mx-auto px-4 py-8 relative z-10">{children}</div>
    </div>
  )
}