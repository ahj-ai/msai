export type GameMode = 'timed' | 'problems'
export type Topic = 'surprise' | 'addition' | 'subtraction' | 'multiplication' | 'division' | 'square' | 'squareRoot' | 'unitCircle'
export type DifficultyLevel = '🧠' | '🧠🧠' | '🧠🧠🧠'

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