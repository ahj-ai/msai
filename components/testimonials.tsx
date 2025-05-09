import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Alex Johnson",
      role: "High School Student",
      content: "MathStackAI has transformed my approach to math. The adaptive games make learning fun and challenging!",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    {
      name: "Sarah Lee",
      role: "Math Teacher",
      content: "As an educator, I find the custom problem sets invaluable for creating tailored assignments for my students.",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    {
      name: "Mike Chen",
      role: "Software Engineer",
      content: "The AI-powered features have helped me brush up on math concepts I use in my work. Highly recommended!",
      avatar: "/placeholder.svg?height=40&width=40"
    }
  ]

  return (
    <section className="py-24 bg-gray-900/50">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-purple-200"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          See What Others Are Saying
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

const TestimonialCard = ({ name, role, content, avatar, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <Card className="bg-gray-800/50 border-purple-500/20">
      <CardContent className="p-6">
        <p className="text-gray-300 mb-4">"{content}"</p>
        <div className="flex items-center">
          <Avatar className="mr-3">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-purple-200">{name}</p>
            <p className="text-sm text-gray-400">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
)

