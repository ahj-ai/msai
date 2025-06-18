"use client"
import { useEffect } from "react"
import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Trophy, Clock, CheckCircle, XCircle, Zap, Hash } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { saveUserProgress } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import type { GameStats, GameMode, DifficultyLevel } from "@/types/game"

interface GameOverScreenProps {
  score: number
  totalTime: number
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  maxStreak: number
  onRestart: () => void
  averageResponseTime: number
  gameMode: GameMode
  difficulty?: DifficultyLevel
  gameOverReason?: 'completed' | 'out_of_lives' | 'time_up'
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
  difficulty = "🧠",
  gameOverReason = 'time_up',
}) => {
  const { user, isLoggedIn } = useAuth()
  
  // Save user progress to Supabase when game ends
  useEffect(() => {
    const saveProgress = async () => {
      if (isLoggedIn && user) {
        try {
          // Prepare game stats for saving
          const gameStats: GameStats = {
            score,
            totalQuestions,
            correctAnswers,
            incorrectAnswers,
            maxStreak,
            averageResponseTime,
            totalTime,
            gameMode,
            difficulty,
          }

          // Save the user's progress
          const result = await saveUserProgress(user.id, gameStats)
          
          if (result.success) {
            console.log('Progress saved successfully')
            // Optional: Show a success toast
            toast({
              title: "Progress Saved",
              description: "Your game progress has been saved to your dashboard.",
              variant: "default",
            })
          } else {
            console.error('Failed to save progress:', result.error)
          }
        } catch (error) {
          console.error('Error saving progress:', error)
        }
      }
    }
    
    saveProgress()
  }, [score, totalQuestions, correctAnswers, incorrectAnswers, maxStreak, averageResponseTime, totalTime, gameMode, difficulty, isLoggedIn, user])
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const accuracy = totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(1) : "0.0"

  return (
    <Card className="w-full max-w-lg mx-auto backdrop-blur-md bg-white shadow-lg rounded-xl overflow-hidden border border-indigo-100">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <CardTitle className="text-4xl font-display font-bold text-center tracking-tight">GAME OVER</CardTitle>
        <div className="text-center opacity-90 mt-2 text-white font-display font-semibold tracking-tight">
          {gameMode === "timed" ? 
            "Mindathlon Complete!" : 
            gameOverReason === 'completed' ? 
              "Challenge Completed!" : 
              gameOverReason === 'out_of_lives' ? 
                "Out of Lives!" : 
                "Time's Up!"}
        </div>
        <div className="text-center opacity-80 mt-2 text-white text-sm font-body leading-relaxed">
          {gameMode === "problems" && gameOverReason === 'out_of_lives' && (
            <span>You used all 3 lives. Better luck next time!</span>
          )}
          {gameMode === "problems" && gameOverReason === 'completed' && (
            <span>Congratulations! You conquered all 100 problems!</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-8 bg-white">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-3xl font-display font-bold text-gray-800 tracking-tight">Final Score</p>
            <p className="text-6xl font-mono font-bold text-indigo-600 mt-2">{score}</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-indigo-50 p-4 rounded-lg shadow-sm border border-indigo-100"
            >
              <div className="flex items-center text-indigo-600 mb-2 font-body">
                <Clock className="w-5 h-5 mr-2" />
                <span>Total Time</span>
              </div>
              <p className="text-2xl font-mono font-bold text-gray-800">{formatTime(totalTime)}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-indigo-900/50 p-4 rounded-lg"
            >
              <div className="flex items-center text-green-300 mb-2 font-body">
                <Hash className="w-5 h-5 mr-2" />
                <span>Problems</span>
              </div>
              <p className="text-2xl font-mono font-bold text-gray-800">{totalQuestions}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-indigo-900/50 p-4 rounded-lg"
            >
              <div className="flex items-center text-green-300 mb-2 font-body">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Correct</span>
              </div>
              <p className="text-2xl font-mono font-bold text-gray-800">{correctAnswers}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-indigo-50 p-4 rounded-lg shadow-sm border border-indigo-100"
            >
              <div className="flex items-center text-red-500 mb-2 font-body">
                <XCircle className="w-5 h-5 mr-2" />
                <span>Incorrect</span>
              </div>
              <p className="text-2xl font-mono font-bold text-gray-800">{incorrectAnswers}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-indigo-50 p-4 rounded-lg shadow-sm border border-indigo-100"
            >
              <div className="flex items-center text-purple-600 mb-2 font-body">
                <Trophy className="w-5 h-5 mr-2" />
                <span>Accuracy</span>
              </div>
              <p className="text-2xl font-mono font-bold text-gray-800">{accuracy}%</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-indigo-50 p-4 rounded-lg shadow-sm border border-indigo-100"
            >
              <div className="flex items-center text-amber-600 mb-2 font-body">
                <Zap className="w-5 h-5 mr-2" />
                <span>Avg Response</span>
              </div>
              <p className="text-2xl font-mono font-bold text-gray-800">{averageResponseTime.toFixed(2)}s</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="col-span-2 bg-indigo-50 p-4 rounded-lg shadow-sm border border-indigo-100"
            >
              <div className="flex items-center text-purple-600 mb-2 font-body">
                <Zap className="w-5 h-5 mr-2" />
                <span>Max Streak</span>
              </div>
              <p className="text-2xl font-mono font-bold text-gray-800">{maxStreak}</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Button
              onClick={onRestart}
              className="w-full h-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-display font-bold tracking-tight rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:from-indigo-500 hover:to-purple-500 hover:-translate-y-1"
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

