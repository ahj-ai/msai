export type GameMode = 'timed' | 'problems'
export type Topic = 'surprise' | 'addition' | 'subtraction' | 'multiplication' | 'division' | 'square' | 'squareRoot' | 'unitCircle'
export type DifficultyLevel = '🧠' | '🧠🧠' | '🧠🧠🧠'

/**
 * Interface for game statistics used for tracking user progress
 */
export interface GameStats {
  score: number
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  maxStreak: number
  averageResponseTime: number
  totalTime: number
  gameMode: GameMode
  difficulty: DifficultyLevel
}

export interface SetupScreenProps {
  onStartGame: (difficulty: DifficultyLevel, timer: number, mode: GameMode) => void
  topic: Topic
  setTopic: (topic: Topic) => void
  difficulty: DifficultyLevel
  setDifficulty: (difficulty: DifficultyLevel) => void
  timerSetting: number
  setTimerSetting: (timer: number) => void
  gameMode: GameMode
  setGameMode: (mode: GameMode) => void
} 