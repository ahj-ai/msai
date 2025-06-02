"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProblemLab } from "@/components/problem-lab"
import { ParticleBackground } from "@/components/particle-background"

export default function ProblemLabPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground lightMode={true} />
      {/* Navigation removed for cleaner interface */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <ProblemLab />
      </div>
    </div>
  )
}

