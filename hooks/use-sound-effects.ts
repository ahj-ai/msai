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
    (frequency: number, duration: number, type: OscillatorType = "sine", volume: number = 0.3) => {
      if (!audioContext) return

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)

      gainNode.gain.setValueAtTime(volume, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.start()
      oscillator.stop(audioContext.currentTime + duration)
      
      return { oscillator, gainNode }
    },
    [audioContext],
  )
  
  // Function to create a more complex melodic pattern
  const playMelodicPattern = useCallback((baseFrequency: number, type: OscillatorType = "sine") => {
    if (!audioContext) return;
    
    // Base notes for the pattern
    const notes = [1, 1.25, 1.5, 2];
    
    notes.forEach((multiplier, index) => {
      setTimeout(() => {
        const frequency = baseFrequency * multiplier;
        playSound(frequency, 0.3, type, 0.2);
      }, index * 100);
    });
  }, [audioContext, playSound]);

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
    playStreakMilestone: () => {
      // Create an immersive, rewarding sound experience
      
      // Start with a bright triumphant fanfare (C major chord arpeggio)
      playSound(523.25, 0.15, "triangle", 0.25) // C5
      setTimeout(() => playSound(659.25, 0.15, "triangle", 0.25), 120) // E5
      setTimeout(() => playSound(783.99, 0.2, "triangle", 0.25), 240) // G5
      
      // Follow with a melodic flourish in higher register
      setTimeout(() => {
        // Bright C6 chord with melodic pattern
        playMelodicPattern(1046.50, "sine") // C6 base frequency
        
        // Add some sparkly high notes
        setTimeout(() => playSound(1567.98, 0.2, "sine", 0.15), 150) // G6
        setTimeout(() => playSound(2093.00, 0.3, "sine", 0.12), 300) // C7
        
        // Add some warm undertones for richness
        setTimeout(() => {
          playSound(261.63, 0.6, "sine", 0.1) // C4 (lower octave)
          
          // Final triumphant high note
          setTimeout(() => {
            // Main celebratory note
            const { oscillator } = playSound(1046.50, 0.8, "sine", 0.2) || {}; // C6
            
            // Add slight vibrato effect if oscillator was created
            if (oscillator && audioContext) {
              const now = audioContext.currentTime;
              const vibratoSpeed = 8;
              const vibratoDepth = 5;
              
              for (let i = 0; i < 8; i++) {
                const timePoint = now + (i * 0.05);
                const freqOffset = Math.sin(i * vibratoSpeed) * vibratoDepth;
                oscillator.frequency.setValueAtTime(1046.50 + freqOffset, timePoint);
              }
            }
          }, 300);
        }, 200);
      }, 400);
    },
  }
}

