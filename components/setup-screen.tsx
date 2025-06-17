"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"
import { Zap, Star, Timer, Brain, Trophy, Clock, Hash, Square, Circle, type LucideIcon } from "lucide-react"
import { type SetupScreenProps, type Topic, type GameMode, type DifficultyLevel } from "@/types/game"

const SetupScreen = ({
  onStartGame,
  topic,
  setTopic,
  difficulty,
  setDifficulty,
  timerSetting,
  setTimerSetting,
  gameMode,
  setGameMode,
}: SetupScreenProps) => {
  const topics: { value: Topic; label: string; icon: LucideIcon }[] = [
    { value: "surprise", label: "Random Mix", icon: Brain },
    { value: "addition", label: "Sum Pro", icon: Trophy },
    { value: "subtraction", label: "Minus Master", icon: Star },
    { value: "multiplication", label: "Times Titan", icon: Timer },
    { value: "division", label: "Divide & Conquer", icon: Zap },
    { value: "square", label: "Square Up", icon: Square },
    { value: "squareRoot", label: "Root Raider", icon: Square },
    { value: "unitCircle", label: "Unit Circle Sage", icon: Circle },
  ]

  const modes: { value: GameMode; label: string; icon: LucideIcon; description: string }[] = [
    {
      value: "timed",
      label: "Neuro Blitz",
      icon: Clock,
      description: "Race against time in this high-speed neural challenge",
    },
    {
      value: "problems",
      label: "Brainiac Challenge",
      icon: Brain,
      description: "100 problems, 5 minutes. Can you get a perfect score?"
    },
  ]

  const difficultyEmojis: DifficultyLevel[] = ["🧠", "🧠🧠", "🧠🧠🧠"]
  const difficultyLabels = ["Genius", "Mastermind", "Brainiac"]
  const problemModeTimes = [10, 5, 2.5] // in minutes

  return (
    <Card className="w-full max-w-lg mx-auto backdrop-blur-md bg-white shadow-lg rounded-xl overflow-hidden border border-indigo-100">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <CardTitle className="text-4xl font-bold text-center tracking-wider">BRAINIAC</CardTitle>
        <div className="text-center opacity-90 mt-2 text-white">Power up your mental math</div>
      </CardHeader>
      <CardContent className="p-8 bg-white">
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Topic Selection</h3>
            <div className="grid grid-cols-2 gap-4">
              {topics.map((t) => {
                const Icon = t.icon
                return (
                  <motion.div key={t.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => setTopic(t.value)}
                      variant={topic === t.value ? "default" : "outline"}
                      className={`w-full h-16 relative group ${
                        topic === t.value
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg border-0"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-indigo-100"
                      }`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="group-hover:opacity-0 transition-opacity">{t.label}</span>
                    </Button>
                  </motion.div>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Difficulty Level</h3>
            <div className="space-y-2">
              <Slider
                value={[difficultyEmojis.indexOf(difficulty) + 1]}
                onValueChange={(value) => setDifficulty(difficultyEmojis[value[0] - 1])}
                min={1}
                max={3}
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-gray-600">
                {difficultyLabels.map((label, i) => (
                  <div key={label} className="text-center">
                    <div className="text-xl mb-1">{difficultyEmojis[i]}</div>
                    <div>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Game Mode</h3>
            <div className="grid grid-cols-1 gap-4">
              {modes.map((m) => {
                const Icon = m.icon
                return (
                  <motion.div key={m.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => setGameMode(m.value)}
                      variant={gameMode === m.value ? "default" : "outline"}
                      className={`w-full h-20 relative group transition-all duration-300 ${
                        gameMode === m.value
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg border-0"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-indigo-100"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-5 h-5" />
                          <span className="font-semibold">{m.label}</span>
                        </div>
                        <span className="text-xs opacity-80">{m.description}</span>
                      </div>
                    </Button>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {gameMode === "timed" && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Time Limit</h3>
              <Slider
                value={[timerSetting]}
                onValueChange={(value) => setTimerSetting(value[0])}
                min={1}
                max={10}
                step={1}
                className="py-4"
              />
              <p className="text-center text-purple-300 mt-2">
                {Math.floor((timerSetting * 30) / 60)}m {(timerSetting * 30) % 60}s
              </p>
            </div>
          )}

          {gameMode === "problems" && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Time Limit</h3>
              <p className="text-center text-gray-600 mt-2">
                {problemModeTimes[difficultyEmojis.indexOf(difficulty)]} minutes
              </p>
            </div>
          )}
        </div>

        <motion.div className="mt-8" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={() => onStartGame(difficulty, timerSetting * 30, gameMode)}
            className="w-full h-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:from-indigo-500 hover:to-purple-500 relative overflow-hidden group"
          >
            <span className="relative z-10">START CHALLENGE</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/30 to-purple-400/0 group-hover:translate-x-full duration-1000 transition-transform"></div>
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  )
}

export default SetupScreen

