"use client"
import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { ArrowLeft, Zap, Star, Timer, Trophy } from "lucide-react"
import "katex/dist/katex.min.css"
import Latex from "react-latex-next"

interface GameScreenProps {
  problem: {
    question: string
    answer: number
  }
  userAnswer: string
  setUserAnswer: (answer: string) => void
  score: number
  timeLeft: number
  onSubmit: () => void
  onBackToMenu: () => void
  streak: number
  lastAnswerTime: number | null
  isCorrect: boolean
  isIncorrect: boolean
  gameMode: "timed" | "problems"
  problemsLeft?: number
}

const GameScreen: React.FC<GameScreenProps> = ({
  problem,
  userAnswer,
  setUserAnswer,
  score,
  timeLeft,
  onSubmit,
  onBackToMenu,
  streak,
  lastAnswerTime,
  isCorrect,
  isIncorrect,
  gameMode,
  problemsLeft,
}) => {
  const inputAnimation = useAnimation()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow negative signs and digits only
    const value = e.target.value.replace(/[^\d-]/g, "")
    // Ensure only one negative sign at the start
    const sanitizedValue = value.replace(/--+/g, "-").replace(/(\d)-/g, "$1")
    setUserAnswer(sanitizedValue)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userAnswer) {
      if (Number.parseInt(userAnswer, 10) !== problem.answer) {
        inputAnimation.start({
          x: [-10, 10, -10, 10, 0],
          transition: { duration: 0.4 },
        })
      }
      onSubmit()
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto backdrop-blur-md bg-white shadow-lg rounded-xl overflow-hidden border border-indigo-100">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex justify-between items-center">
        <Button onClick={onBackToMenu} variant="ghost" className="text-white hover:bg-white/10">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <CardTitle className="text-3xl font-bold tracking-wider">BRAINIAC</CardTitle>
        <div className="w-6" />
      </CardHeader>
      <CardContent className="p-8 bg-white">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border border-indigo-100 shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={problem.question}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-center"
            >
              <motion.div className="text-5xl font-bold text-indigo-700 mb-4 tracking-wider">
                <Latex>{`$${problem.question}$`}</Latex>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-lg p-3 text-center border border-indigo-100 shadow-sm">
              <Timer className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-sm text-gray-600">{gameMode === "timed" ? "Synapse Time" : "Problems Left"}</p>
              <p className="text-xl font-bold text-green-600">
                {gameMode === "timed" ? Math.ceil(timeLeft) : problemsLeft}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center border border-indigo-100 shadow-sm">
              <Trophy className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
              <p className="text-sm text-gray-600">Neural Score</p>
              <p className="text-xl font-bold text-indigo-600">{score}</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center border border-indigo-100 shadow-sm">
              <Zap className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <p className="text-sm text-gray-600">Brain Chain</p>
              <p className="text-xl font-bold text-purple-600">{streak}</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <form onSubmit={handleSubmit}>
            <motion.div animate={inputAnimation}>
              <Input
                type="number"
                inputMode="numeric"
                pattern="-?\d*"
                onChange={handleInputChange}
                value={userAnswer}
                placeholder="Enter neural response..."
                className={`text-center text-2xl py-6 bg-white border text-gray-800 placeholder-gray-400 ${
                  isCorrect
                    ? "ring-2 ring-green-500/50 border-green-500"
                    : isIncorrect
                      ? "ring-2 ring-red-500/50 border-red-500"
                      : "focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 border-indigo-100"
                } transition-all duration-300 shadow-sm`}
              />
            </motion.div>
          </form>
          {isCorrect && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-1/2 right-4 transform -translate-y-1/2"
            >
              <Star className="text-yellow-400 w-6 h-6" />
            </motion.div>
          )}
          {isIncorrect && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-red-500/20 pointer-events-none"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Zap className="text-red-500 w-16 h-16" />
              </motion.div>
            </motion.div>
          )}
        </div>

        {lastAnswerTime && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-600 mt-4">
            Neural response time: {lastAnswerTime.toFixed(2)}s
          </motion.p>
        )}
      </CardContent>
    </Card>
  )
}

export default GameScreen

