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
    <Card className="w-full max-w-lg mx-auto backdrop-blur-md bg-white/10 shadow-2xl rounded-xl overflow-hidden border border-purple-500/20">
      <CardHeader className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white p-6 flex justify-between items-center">
        <Button onClick={onBackToMenu} variant="ghost" className="text-purple-200 hover:bg-purple-500/20">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <CardTitle className="text-3xl font-bold tracking-wider">BRAINIAC</CardTitle>
        <div className="w-6" />
      </CardHeader>
      <CardContent className="p-8 bg-gradient-to-b from-gray-900/95 to-gray-900/90">
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 mb-6 border border-purple-500/20">
          <AnimatePresence mode="wait">
            <motion.div
              key={problem.question}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-center"
            >
              <motion.div className="text-5xl font-bold text-purple-200 mb-4 tracking-wider">
                <Latex>{`$${problem.question}$`}</Latex>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-800/50 rounded-lg p-3 text-center border border-purple-500/20">
              <Timer className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <p className="text-sm text-gray-400">{gameMode === "timed" ? "Synapse Time" : "Problems Left"}</p>
              <p className="text-xl font-bold text-green-400">
                {gameMode === "timed" ? Math.ceil(timeLeft) : problemsLeft}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 text-center border border-purple-500/20">
              <Trophy className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <p className="text-sm text-gray-400">Neural Score</p>
              <p className="text-xl font-bold text-blue-400">{score}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 text-center border border-purple-500/20">
              <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
              <p className="text-sm text-gray-400">Brain Chain</p>
              <p className="text-xl font-bold text-yellow-400">{streak}</p>
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
                className={`text-center text-2xl py-6 bg-gray-800/50 border border-purple-500/20 text-purple-200 placeholder-purple-300/50 ${
                  isCorrect
                    ? "ring-2 ring-green-500/50 border-green-500"
                    : isIncorrect
                      ? "ring-2 ring-red-500/50 border-red-500"
                      : "focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
                } transition-all duration-300`}
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
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-purple-300/70 mt-4">
            Neural response time: {lastAnswerTime.toFixed(2)}s
          </motion.p>
        )}
      </CardContent>
    </Card>
  )
}

export default GameScreen

