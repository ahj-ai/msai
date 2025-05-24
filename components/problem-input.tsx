"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Keyboard, Send, Delete as Backspace } from 'lucide-react'

interface ProblemInputProps {
  onSubmit: (text: string) => void
}

const symbols = [
  ['x', 'y', 'a²', 'aᵇ', '7', '8', '9', '÷'],
  ['(', ')', '<', '>', '4', '5', '6', '×'],
  ['|a|', ',', '≤', '≥', '1', '2', '3', '-'],
  ['√', 'π', '≠', '=', '0', '.', '+', '←']
]

export function ProblemInput({ onSubmit }: ProblemInputProps) {
  const [text, setText] = useState('')
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    onSubmit(text)
    setText('')
  }

  const insertSymbol = (symbol: string) => {
    if (symbol === '←') {
      setText(prev => prev.slice(0, -1))
    } else {
      setText(prev => prev + symbol)
      setIsTyping(true)
      setTimeout(() => setIsTyping(false), 300)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="relative group">
        <Textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setIsTyping(true)
            setTimeout(() => setIsTyping(false), 300)
          }}
          placeholder="Enter your problem or description here..."
          className={`
            min-h-[200px] bg-purple-800/30 border-purple-400/30 text-purple-100
            placeholder-purple-300/50 rounded-xl resize-none p-4
            focus:border-blue-400/50 focus:ring-blue-400/20 transition-all duration-300
            ${isTyping ? 'border-blue-400/50 ring-2 ring-blue-400/20' : ''}
          `}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`
            absolute top-3 right-3 text-purple-300
            hover:text-purple-100 hover:bg-purple-800/50 rounded-lg
            transition-all duration-300
            ${showKeyboard ? 'bg-purple-800/50 text-purple-100' : ''}
          `}
          onClick={() => setShowKeyboard(!showKeyboard)}
        >
          <Keyboard className="w-5 h-5" />
        </Button>
      </div>

      <AnimatePresence>
        {showKeyboard && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-8 gap-2 p-6 bg-purple-800/30 rounded-xl border border-purple-400/30">
              {symbols.map((row, i) => (
                <div key={i} className="contents">
                  {row.map((symbol) => (
                    <motion.div
                      key={symbol}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        className={`
                          w-full h-12 bg-purple-900/30 border-purple-400/30
                          text-purple-100 hover:bg-purple-800/50 hover:text-purple-50
                          rounded-lg font-medium transition-all duration-300
                          ${symbol === '←' ? 'text-blue-400 hover:text-blue-300' : ''}
                        `}
                        onClick={() => insertSymbol(symbol)}
                      >
                        {symbol === '←' ? <Backspace className="w-4 h-4" /> : symbol}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Button 
          type="submit" 
          disabled={!text.trim()}
          className={`
            w-full h-12 bg-blue-600 hover:bg-blue-700 text-white
            font-medium tracking-wide rounded-xl transition-all duration-300
            hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-50
            disabled:cursor-not-allowed disabled:hover:bg-blue-600
            disabled:hover:shadow-none flex items-center justify-center gap-2
          `}
        >
          Generate Problem
          <Send className="w-4 h-4" />
        </Button>
      </motion.div>
    </motion.form>
  )
}

