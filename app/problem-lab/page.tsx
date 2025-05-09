import { ProblemLab } from "@/components/problem-lab"
import { ParticleBackground } from "@/components/particle-background"
import { Beaker } from 'lucide-react'

export default function ProblemLabPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white font-sans antialiased relative overflow-hidden">
      <ParticleBackground />
      <main className="container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 flex items-center justify-center gap-4">
          <Beaker className="w-12 h-12 text-blue-400" />
          Problem Lab
        </h1>
        <ProblemLab />
      </main>
    </div>
  )
}

