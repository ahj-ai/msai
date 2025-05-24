"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"
import { Zap, Star, Timer, Brain, Trophy, Clock, Hash, Square, Circle } from "lucide-react"
import { SetupScreenProps } from "@/types/game"

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
  return (
    <div className="text-center space-y-8">
      <h2 className="text-2xl font-bold">Choose Difficulty</h2>
      <div className="grid grid-cols-3 gap-4">
        <Button onClick={() => onStartGame('🧠', timerSetting, gameMode)} variant="outline">
          Easy
        </Button>
        <Button onClick={() => onStartGame('🧠🧠', timerSetting, gameMode)} variant="outline">
          Medium
        </Button>
        <Button onClick={() => onStartGame('🧠🧠🧠', timerSetting, gameMode)} variant="outline">
          Hard
        </Button>
      </div>
    </div>
  )
}

export default SetupScreen 