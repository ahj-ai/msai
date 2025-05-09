'use client'

import { Button } from '@/components/ui/button'

interface GameOverScreenProps {
  score: number
  onPlayAgain: () => void
}

export function GameOverScreen({ score, onPlayAgain }: GameOverScreenProps) {
  return (
    <div className="text-center space-y-8">
      <h2 className="text-2xl font-bold">Game Over!</h2>
      <p className="text-xl">Final Score: {score}</p>
      <Button onClick={onPlayAgain}>
        Play Again
      </Button>
    </div>
  )
} 