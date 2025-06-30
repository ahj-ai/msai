"use client"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Zap, Star, Timer, Brain, Trophy, Clock, Hash, Square, Circle, Heart, Target, Radical, type LucideIcon } from "lucide-react"
import { type SetupScreenProps, type Topic, type GameMode, type DifficultyLevel } from "@/types/game"
import FloatingShapes from "./floating-shapes"

const GlassmorphismCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`bg-white/30 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:bg-white/40 ${className}`}>
    {children}
  </div>
)

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
        { value: "squareRoot", label: "Root Raider", icon: Radical },
    { value: "unitCircle", label: "Unit Circle Sage", icon: Circle },
  ]

  const modes: { value: GameMode; label: string; icon: LucideIcon; description: string }[] = [
    {
      value: "problems",
      label: "Brainiac Challenge",
      icon: Brain,
      description: "Can you get a perfect score?",
    },
    {
      value: "timed",
      label: "Neuro Blitz",
      icon: Clock,
      description: "Race against time in this high-speed neural challenge",
    },
  ]

  const difficultyOptions: { level: DifficultyLevel; title: string; description: string }[] = [
    { level: "🧠", title: "Genius", description: "Single-digit operations, simple math" },
    { level: "🧠🧠", title: "Mastermind", description: "Two-digit numbers, moderate complexity" },
    { level: "🧠🧠🧠", title: "Brainiac", description: "Advanced problems, max mental challenge" },
  ]

  const timeLimits = [30, 60, 90, 120, 180, 300]

  return (
    <div className="relative min-h-screen w-full text-slate-800 overflow-hidden">
      <FloatingShapes />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#6C63FF] tracking-tighter pb-2">
            BRAINIAC
          </h1>
          <p className="font-mono text-sm md:text-base text-slate-500 mt-2 tracking-wider">Train daily. Progress weekly. Think faster forever.</p>
        </motion.div>

        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Mobile Order: Topic, Game Mode, Difficulty, Time Limit */}
          {/* Desktop Order: Col 1 (Topic, Difficulty), Col 2 (Game Mode, Time Limit) */}

          {/* Topic Selection */}
          <div className="lg:order-1">
            <GlassmorphismCard className="p-6">
              <h3 className="text-2xl font-bold mb-4 text-slate-800">Topic Selection</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {topics.map((t) => {
                  const Icon = t.icon
                  return (
                    <motion.div key={t.value} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <button
                        onClick={() => setTopic(t.value)}
                        className={`w-full aspect-square flex flex-col items-center justify-center rounded-lg transition-all duration-300 font-medium text-sm ${
                          topic === t.value
                            ? "bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg"
                            : "bg-white/20 hover:bg-white/30 text-slate-700"
                        }`}>
                        <Icon className={`w-8 h-8 mb-1.5 ${topic === t.value ? 'text-white/90' : 'text-slate-500'}`} />
                        {t.label}
                      </button>
                    </motion.div>
                  )
                })}
              </div>
            </GlassmorphismCard>
          </div>

          {/* Game Mode */}
          <div className="lg:order-2">
            <GlassmorphismCard className="p-6">
              <h3 className="text-2xl font-bold mb-4 text-slate-800">Game Mode</h3>
              <div className="space-y-4">
                {modes.map((m) => {
                  const Icon = m.icon
                  return (
                    <motion.div key={m.value} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <button
                        onClick={() => setGameMode(m.value)}
                        className={`w-full p-4 rounded-lg text-left transition-all duration-300 ${
                          gameMode === m.value
                            ? "bg-gradient-to-r from-purple-500/90 to-indigo-500/90 text-white shadow-lg"
                            : "bg-white/20 hover:bg-white/30"
                        }`}>
                        <div className="flex items-center mb-1.5">
                          <Icon className={`w-6 h-6 mr-3 ${gameMode === m.value ? 'text-white/90' : 'text-slate-600'}`} />
                          <span className={`font-bold text-lg ${gameMode === m.value ? 'text-white' : 'text-slate-800'}`}>{m.label}</span>
                        </div>
                        {m.value === 'problems' ? (
                          <div className="pl-9">
                            <p className={`text-sm mb-2 ${gameMode === m.value ? 'text-white/80' : 'text-slate-600'}`}>
                              {m.description}
                            </p>
                            <div className={`mt-3 flex items-center space-x-4 text-sm font-medium ${gameMode === m.value ? 'text-white/90' : 'text-slate-700'}`}>
                              <div className="flex items-center">
                                <Target className="w-4 h-4 mr-1.5" />
                                <span>100 Problems</span>
                              </div>
                              <div className="flex items-center">
                                <Heart className="w-4 h-4 mr-1.5 text-red-500" />
                                <span>3 Lives</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1.5" />
                                <span>5 Minutes</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className={`text-sm pl-9 ${gameMode === m.value ? 'text-white/80' : 'text-slate-600'}`}>{m.description}</p>
                        )}
                      </button>
                    </motion.div>
                  )
                })}
              </div>
            </GlassmorphismCard>
          </div>

          {/* Difficulty Level */}
          <div className="lg:order-3">
            <GlassmorphismCard className="p-6">
              <h3 className="text-2xl font-bold mb-4 text-slate-800">Difficulty Level</h3>
              <div className="space-y-4">
                {difficultyOptions.map(({ level, title, description }) => (
                  <motion.div key={level} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <button
                      onClick={() => setDifficulty(level)}
                      className={`w-full p-4 rounded-lg text-left transition-all duration-300 flex items-center ${
                        difficulty === level
                          ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
                          : "bg-white/20 hover:bg-white/30"
                      }`}>
                      <div className="text-3xl mr-4">{level}</div>
                      <div>
                        <h4 className={`font-bold text-lg ${difficulty === level ? 'text-white' : 'text-slate-800'}`}>{title}</h4>
                        <p className={`text-sm ${difficulty === level ? 'text-white/80' : 'text-slate-600'}`}>{description}</p>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </GlassmorphismCard>
          </div>

          {/* Time Limit */}
          {gameMode === 'timed' && (
            <div className="lg:order-4">
              <GlassmorphismCard className="p-6">
                <h3 className="text-2xl font-bold mb-4 text-slate-800">Time Limit</h3>
                <div className="grid grid-cols-3 gap-3">
                  {timeLimits.map((time) => (
                    <motion.div key={time} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <button
                        onClick={() => setTimerSetting(time / 30)}
                        className={`w-full py-3 rounded-lg transition-all duration-300 font-bold ${
                          timerSetting * 30 === time
                            ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
                            : "bg-white/20 hover:bg-white/30 text-slate-700"
                        }`}>
                        {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </GlassmorphismCard>
            </div>
          )}
        </div>

        <motion.div className="mt-8 w-full max-w-md" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            onClick={() => onStartGame(difficulty, timerSetting * 30, gameMode)}
            className="w-full h-16 bg-gradient-to-r from-white/90 to-white/70 text-[#6C63FF] text-2xl font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:from-white/100 hover:to-white/80 relative overflow-hidden group">
            <span className="relative z-10">START CHALLENGE</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-50 group-hover:translate-x-full duration-1000 transition-transform"></div>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

export default SetupScreen
