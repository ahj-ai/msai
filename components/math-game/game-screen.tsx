'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { generateProblem } from '@/lib/math-utils'
import type { DifficultyLevel } from '@/types/game'

interface GameScreenProps {
  difficulty: DifficultyLevel
  onGameOver: (score: number) => void
}

const difficultyMap: Record<DifficultyLevel, "Regular" | "Challenging" | "Advanced"> = {
  "🧠": "Regular",
  "🧠🧠": "Challenging",
  "🧠🧠🧠": "Advanced"
};

export function GameScreen({ difficulty, onGameOver }: GameScreenProps) {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [problem, setProblem] = useState(generateProblem(difficultyMap[difficulty]))
  const [answer, setAnswer] = useState('')

  useEffect(() => {
    if (timeLeft === 0) {
      onGameOver(score)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, score, onGameOver])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (Number(answer) === problem.answer) {
      setScore(prev => prev + 1)
      setProblem(generateProblem(difficultyMap[difficulty]))
      setAnswer('')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <div>Score: {score}</div>
        <div>Time: {timeLeft}s</div>
      </div>
      <div className="text-4xl text-center">
        {problem.question}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded"
          autoFocus
        />
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </div>
  )
} 