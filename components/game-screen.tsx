"use client"
import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { ArrowLeft, Zap, Star, Timer, Trophy, Sparkles } from "lucide-react"
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
  streakMilestone?: boolean
  streakBonus?: number
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
  streakMilestone = false,
  streakBonus = 0,
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

  // Generate sparkles for the streak milestone
  const renderSparkles = () => {
    return Array.from({ length: 8 }).map((_, i) => {
      const randomX = Math.random() * 100;
      const randomY = Math.random() * 100;
      const randomDelay = Math.random() * 0.5;
      const randomSize = Math.random() * 0.5 + 0.5; // 0.5 to 1
      
      return (
        <motion.div
          key={i}
          className="absolute"
          style={{ 
            left: `${randomX}%`, 
            top: `${randomY}%`,
            width: "10px",
            height: "10px"
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, randomSize, 0],
            y: [0, -20, -40]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            delay: randomDelay,
            repeatDelay: Math.random() * 1
          }}
        >
          <Star className="text-yellow-400 w-full h-full" />
        </motion.div>
      );
    });
  };

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
            <div 
              className={`bg-white rounded-lg p-3 text-center border shadow-sm transition-all duration-500 relative overflow-hidden ${
                streak > 0 && streak % 5 === 0 
                  ? "border-purple-500 ring-2 ring-purple-300"
                  : "border-indigo-100"
              }`}
            >
              {streak > 0 && streak % 5 === 0 && streakMilestone && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10"
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              <Zap className={`w-5 h-5 mx-auto mb-1 ${
                streak > 0 && streak % 5 === 0 
                  ? "text-purple-600 animate-pulse"
                  : "text-purple-600"
              }`} />
              <p className="text-sm text-gray-600">Brain Chain</p>
              <motion.p
                animate={
                  streak > 0 && streak % 5 === 0 
                    ? { scale: [1, 1.2, 1], color: ["#7e3af2", "#d946ef", "#7e3af2"] } 
                    : {}
                }
                transition={{ duration: 1.5, repeat: streak > 0 && streak % 5 === 0 ? 2 : 0 }}
                className="text-xl font-bold text-purple-600"
              >
                {streak}
              </motion.p>
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

        {streak > 0 && streak % 5 === 0 && streakMilestone && (
          <AnimatePresence>
            <motion.div
              key="streak-milestone"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 relative overflow-hidden"
            >
              <motion.div 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-lg shadow-lg"
              >
                <div className="relative z-10">
                  <motion.div className="flex flex-col items-center">
                    <motion.div 
                      className="flex items-center gap-2 mb-1"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Sparkles className="h-6 w-6 text-yellow-300" />
                      <motion.p 
                        className="font-bold text-white text-xl"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      >
                        {streak} STREAK!
                      </motion.p>
                      <Sparkles className="h-6 w-6 text-yellow-300" />
                    </motion.div>
                    
                    <motion.div 
                      className="bg-white/90 py-2 px-6 rounded-full shadow-inner flex items-center gap-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <span className="text-purple-800 font-bold text-lg">+{streakBonus} BONUS POINTS</span>
                    </motion.div>
                    
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-white text-sm mt-2 font-medium"
                    >
                      Keep going for even more bonus points!
                    </motion.p>
                  </motion.div>
                </div>
                
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                  {renderSparkles()}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

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

