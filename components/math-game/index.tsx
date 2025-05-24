"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { Topic, GameMode, DifficultyLevel } from "@/types/game"
import { GameScreen } from "./game-screen"
import { GameOverScreen } from "./game-over-screen"
import { useSoundEffects } from "@/hooks/use-sound-effects"

const SetupScreen = dynamic(() => import("./setup-screen"), { ssr: false })

export type GameState = 'setup' | 'playing' | 'gameover'
export type Difficulty = 'easy' | 'medium' | 'hard'

export function MathGame() {
  const [gameState, setGameState] = useState<GameState>('setup')
  const [topic, setTopic] = useState<Topic>("surprise")
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("🧠")
  const [timerSetting, setTimerSetting] = useState(1)
  const [gameMode, setGameMode] = useState<GameMode>("timed")
  const [score, setScore] = useState(0)
  const sounds = useSoundEffects()

  const handleStartGame = (selectedDifficulty: DifficultyLevel, timer: number, mode: GameMode) => {
    setDifficulty(selectedDifficulty);
    setTimerSetting(timer);
    setGameMode(mode);
    setGameState('playing');
    setScore(0);
    sounds.playCorrect();
  }

  const handleGameOver = (finalScore: number) => {
    setScore(finalScore)
    setGameState('gameover')
    sounds.playZap()
  }

  const handlePlayAgain = () => {
    setGameState('setup')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {gameState === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5 }}
          >
            <SetupScreen
              onStartGame={handleStartGame}
              topic={topic}
              setTopic={setTopic}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              timerSetting={timerSetting}
              setTimerSetting={setTimerSetting}
              gameMode={gameMode}
              setGameMode={setGameMode}
            />
          </motion.div>
        )}
        {gameState === 'playing' && (
          <motion.div
            key="game"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <GameScreen 
              difficulty={difficulty} 
              onGameOver={handleGameOver}
            />
          </motion.div>
        )}
        {gameState === 'gameover' && (
          <motion.div
            key="gameover"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <GameOverScreen 
              score={score} 
              onPlayAgain={handlePlayAgain}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MathGame 