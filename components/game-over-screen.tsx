"use client"
import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Trophy, Clock, CheckCircle, XCircle, Zap, Hash } from "lucide-react"

interface GameOverScreenProps {
  score: number
  totalTime: number
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  maxStreak: number
  onRestart: () => void
  averageResponseTime: number
  gameMode: "timed" | "problems"
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  totalTime,
  totalQuestions,
  correctAnswers,
  incorrectAnswers,
  maxStreak,
  onRestart,
  averageResponseTime,
  gameMode,
}) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const accuracy = totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(1) : "0.0"

  return (
    <Card className="w-full max-w-lg mx-auto backdrop-blur-md bg-white/10 shadow-2xl rounded-xl overflow-hidden border border-purple-500/20">
      <CardHeader className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white p-6">
        <CardTitle className="text-4xl font-bold text-center tracking-wider">GAME OVER</CardTitle>
        <div className="text-center opacity-90 mt-2 text-purple-200">
          {gameMode === "timed" ? "Mindathlon Complete!" : "Mindurance Challenge Complete!"}
        </div>
      </CardHeader>
      <CardContent className="p-8 bg-gradient-to-b from-gray-900/95 to-gray-900/90">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-3xl font-bold text-purple-200">Final Score</p>
            <p className="text-6xl font-bold text-purple-400 mt-2">{score}</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-indigo-900/50 p-4 rounded-lg"
            >
              <div className="flex items-center text-blue-300 mb-2">
                <Clock className="w-5 h-5 mr-2" />
                <span>Total Time</span>
              </div>
              <p className="text-2xl font-bold text-blue-200">{formatTime(totalTime)}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-indigo-900/50 p-4 rounded-lg"
            >
              <div className="flex items-center text-green-300 mb-2">
                <Hash className="w-5 h-5 mr-2" />
                <span>Problems</span>
              </div>
              <p className="text-2xl font-bold text-green-200">{totalQuestions}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-indigo-900/50 p-4 rounded-lg"
            >
              <div className="flex items-center text-green-300 mb-2">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Correct</span>
              </div>
              <p className="text-2xl font-bold text-green-200">{correctAnswers}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-indigo-900/50 p-4 rounded-lg"
            >
              <div className="flex items-center text-red-300 mb-2">
                <XCircle className="w-5 h-5 mr-2" />
                <span>Incorrect</span>
              </div>
              <p className="text-2xl font-bold text-red-200">{incorrectAnswers}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-indigo-900/50 p-4 rounded-lg"
            >
              <div className="flex items-center text-purple-300 mb-2">
                <Trophy className="w-5 h-5 mr-2" />
                <span>Accuracy</span>
              </div>
              <p className="text-2xl font-bold text-purple-200">{accuracy}%</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-indigo-900/50 p-4 rounded-lg"
            >
              <div className="flex items-center text-yellow-300 mb-2">
                <Zap className="w-5 h-5 mr-2" />
                <span>Avg Response</span>
              </div>
              <p className="text-2xl font-bold text-yellow-200">{averageResponseTime.toFixed(2)}s</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="col-span-2 bg-indigo-900/50 p-4 rounded-lg"
            >
              <div className="flex items-center text-purple-300 mb-2">
                <Zap className="w-5 h-5 mr-2" />
                <span>Max Streak</span>
              </div>
              <p className="text-2xl font-bold text-purple-200">{maxStreak}</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Button
              onClick={onRestart}
              className="w-full h-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:from-indigo-500 hover:to-purple-500"
            >
              Play Again
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}

export default GameOverScreen

