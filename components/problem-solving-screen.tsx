'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, XCircle, ArrowRight, Lightbulb } from 'lucide-react'

interface ProblemSolvingScreenProps {
  problem: {
    question: string
    solution: string
    steps: string[]
  }
  onBackToMenu: () => void
  onNextProblem: () => void
}

const ProblemSolvingScreen: React.FC<ProblemSolvingScreenProps> = ({ problem, onBackToMenu, onNextProblem }) => {
  const [userAnswer, setUserAnswer] = useState('')
  const [showSolution, setShowSolution] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsCorrect(userAnswer.trim().toLowerCase() === problem.solution.toLowerCase())
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full md:max-w-3xl mx-auto backdrop-blur-md bg-purple-900/20 shadow-2xl rounded-xl overflow-hidden border border-purple-400/30 hover:shadow-purple-500/10 transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-900/80 to-purple-900/80 text-white p-8 border-b border-purple-400/30">
          <CardTitle className="text-3xl font-light text-center tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300">
            Problem Lab
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 bg-gradient-to-b from-gray-900/95 to-purple-900/90">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl text-purple-100 font-medium mb-8 bg-purple-800/30 p-6 rounded-xl border border-purple-400/30 shadow-lg"
          >
            <span>{problem.question}</span>
          </motion.div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your answer"
                className="w-full h-12 bg-purple-800/30 border-purple-400/30 text-purple-100 placeholder-purple-300/50 focus:border-blue-400/50 focus:ring-blue-400/20 transition-all duration-300"
              />
            </motion.div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button 
                type="submit" 
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium tracking-wide rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 h-12"
              >
                Check Answer
              </Button>
              <Button 
                type="button" 
                onClick={() => setShowSolution(!showSolution)} 
                variant="outline" 
                className="w-full sm:w-auto border-purple-400/30 text-purple-100 hover:bg-purple-800/30 hover:text-purple-200 transition-all duration-300 h-12 rounded-xl"
              >
                {showSolution ? 'Hide Solution' : 'Show Solution'}
              </Button>
            </div>
          </form>
          {isCorrect !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}
            >
              {isCorrect ? (
                <div className="flex items-center text-green-400">
                  <CheckCircle className="mr-2" />
                  Correct! Well done!
                </div>
              ) : (
                <div className="flex items-center text-red-400">
                  <XCircle className="mr-2" />
                  Not quite. Try again or check the solution.
                </div>
              )}
            </motion.div>
          )}
          {showSolution && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.5 }}
              className="space-y-6 bg-purple-800/30 p-6 rounded-xl border border-purple-400/30 shadow-lg"
            >
              <div className="font-medium text-blue-300 text-xl flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Solution:
              </div>
              <div className="text-purple-100 text-2xl font-light">
                <span>{problem.solution}</span>
              </div>
              <div className="font-medium text-blue-300 text-xl mt-8 flex items-center gap-2">
                <ArrowRight className="w-5 h-5" />
                Steps:
              </div>
              <ol className="list-decimal list-inside space-y-3">
                {problem.steps.map((step, index) => {
                  const [title, content] = step.includes(':') 
                    ? step.split(':') 
                    : [null, step];
                  
                  return (
                    <li key={index} className="text-purple-200">
                      {title && (
                        <span className="font-bold text-purple-300">
                          {title}:
                        </span>
                      )}
                      <span className="ml-2">
                        <span>{content}</span>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </motion.div>
          )}
          <div className="flex flex-col sm:flex-row justify-between mt-6 space-y-2 sm:space-y-0">
            <Button 
              onClick={onBackToMenu} 
              variant="ghost" 
              className="w-full sm:w-auto text-purple-200 hover:text-purple-100 hover:bg-purple-800/30 transition-all duration-300 h-12 rounded-xl"
            >
              Back to Menu
            </Button>
            <Button 
              onClick={onNextProblem} 
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium tracking-wide rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 h-12"
            >
              Next Problem <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
      </Card>
    </motion.div>
  )
}

export default ProblemSolvingScreen

