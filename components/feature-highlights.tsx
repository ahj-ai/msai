import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Gamepad2, FlaskRoundIcon as Flask } from 'lucide-react'

export const FeatureHighlights = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Track Your Learning Progress",
      description: "Monitor your improvement over time with personalized insights."
    },
    {
      icon: Gamepad2,
      title: "Adaptive Math Games",
      description: "Challenge yourself with adaptive learning experiences."
    },
    {
      icon: Flask,
      title: "Custom Problem Sets",
      description: "Create and solve problems tailored to your learning goals."
    }
  ]

  return (
    <section className="py-24 bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon: Icon, title, description, index }: FeatureCardProps) => (
  <motion.div 
    className="bg-gray-800/50 rounded-lg p-6 shadow-lg border border-purple-500/20"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <Icon className="w-12 h-12 text-purple-400 mb-4" />
    <h3 className="text-xl font-semibold text-purple-200 mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </motion.div>
)

