"use client"

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Flask, Sparkles } from 'lucide-react'

export function ChemicalReactionLoader() {
  return (
    <div className="relative flex flex-col items-center gap-6">
      <div className="relative">
        <motion.div
          initial={{ scale: 1 }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative"
        >
          <Flask className="w-16 h-16 text-blue-400" />
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{
              opacity: [0.5, 1, 0.5],
              y: [0, -10, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 flex justify-center"
          >
            <Sparkles className="w-6 h-6 text-purple-400" />
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ scale: 1, opacity: 0 }}
          animate={{
            scale: [1, 1.5],
            opacity: [0.8, 0]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeOut"
          }}
          className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl"
        />
      </div>
      <p className="text-lg font-medium text-purple-200 animate-pulse">
        Generating Problem...
      </p>
    </div>
  )
}

