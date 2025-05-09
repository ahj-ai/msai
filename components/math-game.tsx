"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { generateProblem } from "@/utils/generate-problem"
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
  const [topic, setTopic] = useState("surprise")
  const [difficulty, setDifficulty] = useState("🧠")
  const [timerSetting, setTimerSetting] = useState(1)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [lastAnswerTime, setLastAnswerTime] = useState(null)
  const [questionStartTime, setQuestionStartTime] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isIncorrect, setIsIncorrect] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [incorrectAnswers, setIncorrectAnswers] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [totalResponseTime, setTotalResponseTime] = useState(0)
  const [gameMode, setGameMode] = useState("timed")
  const [problemsLeft, setProblemsLeft] = useState(100)

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

  const checkAnswer = useCallback(() => {
    const answerTime = (Date.now() - questionStartTime) / 1000
    setLastAnswerTime(answerTime)
    setTotalResponseTime((prev) => prev + answerTime)

    const submittedAnswer = Number.parseFloat(userAnswer)
    const correctAnswer = Number.parseFloat(problem.answer)
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
      if (newStreak > 0) {
        points += Math.floor(newStreak / 5)
      }

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
      setIncorrectAnswers((prev) => prev + 1)
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
    if (gameMode === "timed") {
      setTimeLeft(timerSetting * 30)
    } else if (gameMode === "problems") {
      setProblemsLeft(100)
      const problemModeTimes = [10, 5, 2.5]
      setTimeLeft(problemModeTimes[["🧠", "🧠🧠", "🧠🧠🧠"].indexOf(difficulty)] * 60)
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
    let timer
    if (isGameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 10) soundEffects.playTimer()
          return prev - 1
        })
        setTotalTime((prev) => prev + 1)
      }, 1000)
    } else if (timeLeft <= 0 || (gameMode === "problems" && problemsLeft <= 0)) {
      setIsGameActive(false)
      setGameOver(true)
    }
    return () => clearInterval(timer)
  }, [isGameActive, timeLeft, gameMode, problemsLeft, soundEffects])

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
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default MathGame

