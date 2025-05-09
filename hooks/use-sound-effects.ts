"use client"

import { useState, useEffect, useCallback } from "react"

export const useSoundEffects = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)

  useEffect(() => {
    const initAudioContext = () => {
      if (!audioContext) {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)()
        setAudioContext(context)
      }
      document.removeEventListener("click", initAudioContext)
      document.removeEventListener("keydown", initAudioContext)
    }

    document.addEventListener("click", initAudioContext)
    document.addEventListener("keydown", initAudioContext)

    return () => {
      document.removeEventListener("click", initAudioContext)
      document.removeEventListener("keydown", initAudioContext)
    }
  }, [audioContext])

  const playSound = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "sine") => {
      if (!audioContext) return

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.start()
      oscillator.stop(audioContext.currentTime + duration)
    },
    [audioContext],
  )

  return {
    playCorrect: () => playSound(800, 0.1, "sine"),
    playWrong: () => playSound(200, 0.3, "sawtooth"),
    playTimer: () => playSound(600, 0.1, "square"),
    playCelebration: () => {
      playSound(800, 0.1)
      setTimeout(() => playSound(1000, 0.1), 100)
      setTimeout(() => playSound(1200, 0.1), 200)
    },
    playZap: () => {
      playSound(60, 0.1, "sawtooth")
      setTimeout(() => playSound(80, 0.1, "sawtooth"), 50)
      setTimeout(() => playSound(40, 0.1, "sawtooth"), 100)
    },
  }
}

