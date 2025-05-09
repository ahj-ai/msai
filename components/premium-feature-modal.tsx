import React from 'react'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles, Star, Zap, Crown } from 'lucide-react'
import Link from 'next/link'

interface PremiumFeatureModalProps {
  featureName: string
  children: React.ReactNode
}

const features = [
  {
    icon: Star,
    title: 'Advanced AI Generation',
    description: 'Get access to our most advanced AI problem generation capabilities'
  },
  {
    icon: Zap,
    title: 'Instant Solutions',
    description: 'Step-by-step explanations and instant problem-solving guidance'
  },
  {
    icon: Crown,
    title: 'Premium Content',
    description: 'Access our library of curated problems and specialized topics'
  }
]

export const PremiumFeatureModal: React.FC<PremiumFeatureModalProps> = ({ featureName, children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-b from-purple-900 to-gray-900 text-purple-100 border border-purple-400/30 shadow-xl">
        <DialogHeader className="space-y-4">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="relative">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="h-8 w-8 text-yellow-400" />
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
                className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl"
              />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-400">
              Premium Feature: {featureName}
            </span>
          </DialogTitle>
          <DialogDescription className="text-lg text-purple-200">
            Experience the full power of our AI-driven problem-solving platform.
          </DialogDescription>
        </DialogHeader>

        <motion.div 
          className="grid gap-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-purple-800/30 border border-purple-400/30"
            >
              <feature.icon className="w-5 h-5 text-yellow-400 mt-1" />
              <div>
                <h4 className="font-medium text-purple-100">{feature.title}</h4>
                <p className="text-sm text-purple-300">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/pricing" className="block">
            <Button 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium tracking-wide rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
            >
              Upgrade to Premium
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

