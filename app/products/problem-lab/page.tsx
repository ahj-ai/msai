import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { FlaskRoundIcon as Flask, Sparkles, Target, Book } from "lucide-react"
import Link from "next/link"

export default function ProblemLabPreviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-indigo-900 text-white">
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Problem Lab: Master Math Concepts
        </h1>
        <p className="text-xl text-center text-purple-200 mb-12">
          Dive deep into math concepts with our AI-powered problem generator and step-by-step solutions!
        </p>
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-800/50 rounded-lg p-6 border border-purple-500/20">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">Key Features</h2>
            <ul className="space-y-4">
              <Feature icon={Flask} text="AI-generated problems tailored to your level" />
              <Feature icon={Sparkles} text="Step-by-step solutions for every problem" />
              <Feature icon={Target} text="Personalized learning paths" />
              <Feature icon={Book} text="Comprehensive coverage of math topics" />
            </ul>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-6 border border-purple-500/20">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">How It Works</h2>
            <ol className="list-decimal list-inside space-y-4 text-purple-200">
              <li>Select your math subject and topic of interest</li>
              <li>Choose your difficulty level</li>
              <li>Get AI-generated problems tailored to your needs</li>
              <li>Solve problems and access detailed step-by-step solutions</li>
              <li>Track your progress and master new concepts</li>
            </ol>
          </div>
        </div>
        <div className="text-center">
          <Link href="/signup">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-xl py-6 px-8">
              Explore Problem Lab
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function Feature({ icon: Icon, text }) {
  return (
    <li className="flex items-center space-x-3 text-purple-200">
      <Icon className="w-6 h-6 text-purple-400" />
      <span>{text}</span>
    </li>
  )
}

