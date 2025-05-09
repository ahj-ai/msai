'use client'

import React, { useState } from "react"
import { FlaskRoundIcon as Flask, Sparkles } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateProblem } from "@/lib/generate-problem"
import { ParticleBackground } from "./particle-background"
import { ChemicalReactionLoader } from "./chemical-reaction-loader"
import { ImageUpload } from "./image-upload"
import { ProblemInput } from "./problem-input"
import ProblemSolvingScreen from "./problem-solving-screen"
import { PremiumFeatureModal } from "./premium-feature-modal"

const subjects = {
  "algebra-1": {
    name: "Algebra I",
    topics: ["Linear Equations", "Systems of Equations", "Factoring Quadratics", "Inequalities", "Functions", "Word Problems"]
  },
  "geometry": {
    name: "Geometry",
    topics: ["Angles", "Triangles", "Circles", "Area/Volume", "Proofs (basic)", "Word Problems"]
  },
  "trigonometry": {
    name: "Trigonometry",
    topics: ["Unit Circle", "Trig Identities", "Solving Triangles", "Graphs of Trig Functions", "Word Problems"]
  },
  "pre-calculus": {
    name: "Pre-Calculus",
    topics: ["Limits", "Sequences and Series", "Exponential and Logarithmic Functions", "Conic Sections", "Word Problems"]
  },
  "calculus": {
    name: "Calculus",
    topics: ["Derivatives (basic)", "Integrals (basic)", "Limits", "Related Rates (word problems)", "Word Problems"]
  },
};

const difficulties = ["Easy", "Regular", "Hard"];

// Topics that support word problems (for checkbox display)
const wordProblemTopics = [
  "Word Problems",
  "Related Rates (word problems)",
];

interface Problem {
  question: string
  solution: string
  steps: string[]
}

export function ProblemLab() {
  const [subject, setSubject] = useState<keyof typeof subjects>("algebra-1")
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("Regular")
  const [wordProblems, setWordProblems] = useState(false)
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [inputMethod, setInputMethod] = useState<'generate' | 'image' | 'custom'>('generate')
  const [showProblemSolving, setShowProblemSolving] = useState(false)
  const [comingSoonOpen, setComingSoonOpen] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

  // Generate problem (used for both initial and regenerate)
  const handleGenerateProblem = async () => {
    if (!topic) return
    setIsLoading(true)
    try {
      const problem = await generateProblem({
        subject,
        topic,
        difficulty: difficulty as string,
        wordProblems,
      })
      if ((problem as any).comingSoon) {
        setComingSoonOpen(true)
        setIsLoading(false)
        return
      }
      setCurrentProblem(problem as Problem)
      setShowProblemSolving(true)
      setShowSolution(false)
    } catch (error) {
      console.error("Error generating problem:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Regenerate problem with current settings
  const handleRegenerate = () => {
    handleGenerateProblem();
  };

  // Toggle solution view
  const handleShowSolution = () => {
    setShowSolution((prev) => !prev);
  };

  const PremiumIndicator = () => (
    <Sparkles className="w-3 h-3 text-yellow-400 inline ml-1" />
  )

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center py-10 bg-[#1a0a2e] overflow-hidden">
      <ParticleBackground />
      {!showProblemSolving ? (
        <Card className="w-full max-w-3xl mx-auto backdrop-blur-md bg-white/10 shadow-2xl rounded-xl overflow-hidden">
          <CardHeader className="bg-transparent text-white p-6">
            <CardTitle className="text-2xl font-light tracking-wide text-purple-100 flex items-center gap-3">
              <Flask className="w-6 h-6 text-blue-400" />
              Lab Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 bg-transparent">
            <Tabs defaultValue="generate" className="mb-6">
              <TabsList className="w-full bg-transparent p-1 rounded-xl">
                <TabsTrigger 
                  value="generate" 
                  className="flex-1 data-[state=active]:bg-blue-600/50 text-purple-100 rounded-lg transition-all duration-300"
                >
                  Generate
                </TabsTrigger>
                <TabsTrigger 
                  value="image" 
                  className="flex-1 data-[state=active]:bg-blue-600/50 text-purple-100 rounded-lg transition-all duration-300"
                >
                  Image <PremiumIndicator />
                </TabsTrigger>
                <TabsTrigger 
                  value="custom" 
                  className="flex-1 data-[state=active]:bg-blue-600/50 text-purple-100 rounded-lg transition-all duration-300"
                >
                  Custom <PremiumIndicator />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="generate" className="space-y-6 mt-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-purple-200">Subject</Label>
                      <Select 
                        value={subject} 
                        onValueChange={(value: keyof typeof subjects) => setSubject(value)}
                      >
                        <SelectTrigger className="mt-2 bg-purple-800/30 border-purple-400/30 text-purple-100 h-11 hover:bg-purple-700/30 transition-colors">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent className="bg-purple-900 border-purple-400/30">
                          {Object.entries(subjects).map(([key, { name }]) => (
                            <SelectItem key={key} value={key} className="text-purple-100">
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-purple-200">Topic</Label>
                      <Select value={topic} onValueChange={setTopic}>
                        <SelectTrigger className="mt-2 bg-purple-800/30 border-purple-400/30 text-purple-100 h-11 hover:bg-purple-700/30 transition-colors">
                          <SelectValue placeholder="Select topic" />
                        </SelectTrigger>
                        <SelectContent className="bg-purple-900 border-purple-400/30">
                          {subjects[subject].topics.map((topic) => (
                            <SelectItem key={topic} value={topic} className="text-purple-100">
                              {topic}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-purple-200">Difficulty</Label>
                      <Select value={difficulty} onValueChange={setDifficulty}>
                        <SelectTrigger className="mt-2 bg-purple-800/30 border-purple-400/30 text-purple-100 h-11 hover:bg-purple-700/30 transition-colors">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-purple-900 border-purple-400/30">
                          {difficulties.map((diff) => (
                            <SelectItem key={diff} value={diff} className="text-purple-100">
                              {diff}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {wordProblemTopics.includes(topic) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Checkbox
                            id="word-problems"
                            checked={wordProblems}
                            onCheckedChange={(checked: boolean) => setWordProblems(checked)}
                          />
                          <Label 
                            htmlFor="word-problems" 
                            className="text-sm font-medium text-purple-200"
                          >
                            Include word problems
                          </Label>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-row gap-4">
                    <Button
                      onClick={handleGenerateProblem}
                      disabled={!topic || isLoading}
                      className="w-full h-12 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium tracking-wide rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                    >
                      Generate Problem
                    </Button>
                    <Button
                      onClick={handleRegenerate}
                      disabled={!topic || isLoading}
                      className="w-full h-12 mt-6 bg-purple-700 hover:bg-purple-800 text-white font-medium tracking-wide rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
                    >
                      Regenerate
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="image">
                <ImageUpload onUpload={() => {}} />
                <div className="text-center p-8 bg-purple-800/30 rounded-xl border border-purple-500/20 mt-4">
                  <h3 className="text-2xl font-semibold text-purple-100 mb-3">
                    Upload Image
                  </h3>
                  <p className="text-purple-200 mb-6 text-lg">
                    Upload and analyze math problems from images
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="custom">
  <ProblemInput onSubmit={(text) => console.log(text)} />
  <div className="text-center p-8 bg-purple-800/30 rounded-xl border border-purple-500/20 mt-4">
    <h3 className="text-2xl font-semibold text-purple-100 mb-3">
      Enter your own problem
    </h3>
    <p className="text-purple-200 mb-6 text-lg">
      Enter custom math problems using LaTeX or plain text with the keyboard below.
    </p>
  </div>
</TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <div className="w-full max-w-3xl mx-auto mt-10">
          {currentProblem && (
            <Card className="bg-white/10 shadow-2xl rounded-xl overflow-hidden border border-purple-500/20">
              <CardHeader className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white p-6">
                <CardTitle className="text-2xl font-bold text-purple-100">Generated Problem</CardTitle>
              </CardHeader>
              <CardContent className="p-8 bg-gradient-to-b from-gray-900/95 to-gray-900/90">
                <div className="mb-6 text-lg text-purple-100 whitespace-pre-line">
                  {currentProblem.question}
                </div>
                <div className="flex flex-row gap-4 mb-6">
                  <Button onClick={handleRegenerate} className="bg-purple-700 hover:bg-purple-800 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                    Regenerate
                  </Button>
                  <Button onClick={handleShowSolution} className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                    {showSolution ? 'Hide Solution' : 'Show Solution'}
                  </Button>
                  <Button onClick={() => setShowProblemSolving(false)} className="bg-gray-700 hover:bg-gray-800 text-white font-medium rounded-xl transition-all duration-300">
                    Back
                  </Button>
                </div>
                {showSolution && (
                  <div className="bg-purple-900/40 rounded-lg p-6 text-purple-100">
                    <div className="font-bold mb-2">Solution:</div>
                    <div className="mb-2 whitespace-pre-line">{currentProblem.solution}</div>
                    {currentProblem.steps && currentProblem.steps.length > 0 && (
                      <div>
                        <div className="font-semibold mb-1">Steps:</div>
                        <ol className="list-decimal ml-6">
                          {currentProblem.steps.map((step, idx) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {isLoading && (
        <Card className="bg-purple-900/30 border-purple-400/30 backdrop-blur-sm shadow-xl">
          <CardContent className="flex justify-center items-center h-48">
            <ChemicalReactionLoader />
          </CardContent>
        </Card>
      )}
      {/* Coming Soon Modal */}
      {comingSoonOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-gradient-to-b from-purple-900 to-gray-900 p-8 rounded-2xl border border-purple-400/30 shadow-2xl max-w-lg w-full text-center">
            <h2 className="text-3xl font-bold text-purple-100 mb-4">Coming Soon</h2>
            <p className="text-purple-200 mb-6 text-lg">This topic or type of problem will soon be available with AI-powered generation.</p>
            <Button onClick={() => setComingSoonOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-xl transition-all duration-300">Close</Button>
          </div>
        </div>
      )}
    </div>
  )
}

