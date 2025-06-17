"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { generateProblem } from "@/utils/generate-problem"
import type { Topic, GameMode } from "@/types/game"
import { useSoundEffects } from "@/hooks/use-sound-effects"

const SetupScreen = dynamic(() => import("./setup-screen"), { ssr: false })
const GameScreen = dynamic(() => import("./game-screen"), { ssr: false })
const GameOverScreen = dynamic(() => import("./game-over-screen"), { ssr: false })

const MathGame = () => {
  const [isMounted, setIsMounted] = useState(false)
  const [problem, setProblem] = useState({ question: "", answer: 0 })
  const [userAnswer, setUserAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isGameActive, setIsGameActive] = useState(false)
  const [topic, setTopic] = useState<Topic>("surprise")
  const [lives, setLives] = useState(3)
  type Difficulty = "🧠" | "🧠🧠" | "🧠🧠🧠"
const [difficulty, setDifficulty] = useState<Difficulty>("🧠")
  const [timerSetting, setTimerSetting] = useState(1)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [lastAnswerTime, setLastAnswerTime] = useState<number | null>(null)
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isIncorrect, setIsIncorrect] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [incorrectAnswers, setIncorrectAnswers] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [totalResponseTime, setTotalResponseTime] = useState(0)
  const [gameMode, setGameMode] = useState<GameMode>("timed")
  const [problemsLeft, setProblemsLeft] = useState(100)
  const [streakMilestone, setStreakMilestone] = useState(false)
  const [streakBonus, setStreakBonus] = useState(0)
  // Track the reason for game over: completed all problems, ran out of lives, or time ran out
  const [gameOverReason, setGameOverReason] = useState<'completed' | 'out_of_lives' | 'time_up'>('time_up')

  const soundEffects = useSoundEffects()

  const generateNewProblem = useCallback(() => {
    const newProblem = generateProblem(topic, difficulty)
    setProblem(newProblem)
    setQuestionStartTime(Date.now())
    setTotalQuestions((prev) => prev + 1)
    if (gameMode === "problems") {
      setProblemsLeft((prev) => prev - 1)
    }
  }, [topic, difficulty, gameMode])

  // Calculate streak bonus points
  const calculateStreakBonus = (streakCount: number) => {
    const milestoneLevel = Math.floor(streakCount / 5);
    // Progressive bonus: 3 for first milestone (5), 6 for second (10), etc.
    return milestoneLevel * 3;
  };

  const checkAnswer = useCallback(() => {
    if (questionStartTime === null) return;
    const answerTime = (Date.now() - questionStartTime) / 1000
    setLastAnswerTime(answerTime)
    setTotalResponseTime((prev) => prev + answerTime)

    const submittedAnswer = Number.parseFloat(userAnswer)
    const correctAnswer = problem.answer
    const isCorrect = Math.abs(submittedAnswer - correctAnswer) < 0.01

    if (isCorrect) {
      soundEffects.playCorrect()
      setIsCorrect(true)
      setCorrectAnswers((prev) => prev + 1)

      let points = 1
      if (answerTime < 3) points += 3
      else if (answerTime < 5) points += 2
      else if (answerTime < 10) points += 1

      const newStreak = streak + 1
      setStreak(newStreak)
      setMaxStreak((prev) => Math.max(prev, newStreak))
      
      // Calculate and apply streak bonus points
      let bonusPoints = 0;
      if (newStreak > 0 && newStreak % 5 === 0) {
        // Calculate bonus points based on streak milestone
        bonusPoints = calculateStreakBonus(newStreak);
        setStreakBonus(bonusPoints);
        
        // Play special sound for streak milestones
        soundEffects.playStreakMilestone();
        setStreakMilestone(true);
        
        // Reset the streak milestone flag after some time
        setTimeout(() => {
          setStreakMilestone(false);
          setStreakBonus(0);
        }, 4000); // Extend display time to 4 seconds
      } else {
        // Regular streak points
        bonusPoints = Math.floor(newStreak / 5);
      }
      
      points += bonusPoints;

      setScore((prevScore) => {
        const newScore = prevScore + points
        if (newScore % 50 === 0) {
          setShowConfetti(true)
          soundEffects.playCelebration()
          setTimeout(() => setShowConfetti(false), 2000)
        }
        return newScore
      })

      setTimeout(() => {
        setIsCorrect(false)
        generateNewProblem()
        setUserAnswer("")
      }, 500)
    } else if (userAnswer !== "") {
      soundEffects.playZap()
      setIsIncorrect(true)
      setStreak(0)
      setStreakBonus(0)
      setIncorrectAnswers((prev) => prev + 1)
      
      // For problems mode, decrement lives on incorrect answers
      if (gameMode === "problems") {
        setLives(prev => {
          const newLives = prev - 1;
          // Check if this was the last life
          if (newLives <= 0) {
            setGameOverReason('out_of_lives');
            setTimeout(() => {
              setIsGameActive(false);
              setGameOver(true);
            }, 1000);
          }
          return newLives;
        });
      }
      
      setTimeout(() => {
        setIsIncorrect(false)
        setUserAnswer("")
      }, 800)
    }
  }, [userAnswer, problem.answer, questionStartTime, streak, soundEffects, generateNewProblem])

  const startGame = useCallback(() => {
    setIsGameActive(true)
    setScore(0)
    setStreak(0)
    setMaxStreak(0)
    setTotalQuestions(0)
    setCorrectAnswers(0)
    setIncorrectAnswers(0)
    setTotalTime(0)
    setTotalResponseTime(0)
    setStreakMilestone(false)
    setStreakBonus(0)
    setLives(3)
    if (gameMode === "timed") {
      setTimeLeft(timerSetting * 30)
    } else if (gameMode === "problems") {
      setProblemsLeft(100)
      // All difficulties set to 5 minutes (300 seconds)
      setTimeLeft(5 * 60)
    }
    generateNewProblem()
  }, [timerSetting, generateNewProblem, gameMode, difficulty])

  const restartGame = useCallback(() => {
    setGameOver(false)
    startGame()
  }, [startGame])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>
    if (isGameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 10) soundEffects.playTimer()
          return prev - 1
        })
        setTotalTime((prev) => prev + 1)
      }, 1000)
    } else if (timeLeft <= 0 || (gameMode === "problems" && problemsLeft <= 0)) {
      // Set the reason for game over
      if (timeLeft <= 0) {
        setGameOverReason('time_up');
      } else if (gameMode === "problems" && problemsLeft <= 0) {
        setGameOverReason('completed');
      }
      
      setIsGameActive(false);
      setGameOver(true);
    }
    return () => clearInterval(timer)
  }, [isGameActive, timeLeft, gameMode, problemsLeft, soundEffects])

  // Reset game over reason when starting a new game
  useEffect(() => {
    if (isGameActive) {
      setGameOverReason('time_up'); // Default reason, will be updated if needed
    }
  }, [isGameActive])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {!isGameActive && !gameOver ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5 }}
          >
            <SetupScreen
              onStartGame={(difficulty, timer, mode) => {
                setDifficulty(difficulty)
                setTimerSetting(timer / 30)
                setGameMode(mode)
                startGame()
              }}
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
        ) : gameOver ? (
          <motion.div
            key="gameover"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <GameOverScreen
              score={score}
              totalTime={totalTime}
              totalQuestions={totalQuestions}
              correctAnswers={correctAnswers}
              incorrectAnswers={incorrectAnswers}
              maxStreak={maxStreak}
              averageResponseTime={totalResponseTime / totalQuestions}
              onRestart={restartGame}
              gameMode={gameMode}
              difficulty={difficulty}
              gameOverReason={gameOverReason}
            />
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <GameScreen
              problem={problem}
              userAnswer={userAnswer}
              setUserAnswer={setUserAnswer}
              score={score}
              timeLeft={timeLeft}
              problemsLeft={gameMode === "problems" ? problemsLeft : undefined}
              onSubmit={checkAnswer}
              onBackToMenu={() => {
                setIsGameActive(false)
                setGameOver(false)
              }}
              streak={streak}
              lastAnswerTime={lastAnswerTime}
              isCorrect={isCorrect}
              isIncorrect={isIncorrect}
              gameMode={gameMode}
              streakMilestone={streakMilestone}
              streakBonus={streakBonus}
              lives={lives}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default MathGame

