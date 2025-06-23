"use client"
import React, { useState, useEffect } from 'react'
import { Brain, Clock, Target, Award, Zap, BookOpen, Sparkles, Calculator, TrendingUp, Users } from 'lucide-react'

export function WhyMathStackAI() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [animatedNumber, setAnimatedNumber] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedNumber(prev => prev < 94.7 ? prev + 0.1 : 94.7)
    }, 50)
    return () => clearInterval(timer)
  }, [])

  const features = [
    { icon: Brain, title: "AI-Powered Understanding", desc: "Break down complex concepts into digestible steps", color: "from-purple-500 to-pink-500" },
    { icon: Clock, title: "Learn at Your Pace", desc: "Adaptive learning that fits your schedule", color: "from-blue-500 to-cyan-500" },
    { icon: Zap, title: "Gamified Practice", desc: "Make math fun with interactive challenges", color: "from-yellow-500 to-orange-500" },
    { icon: Target, title: "24/7 Availability", desc: "Get help whenever you need it most", color: "from-green-500 to-emerald-500" },
    { icon: Award, title: "Build Confidence", desc: "Track progress and celebrate achievements", color: "from-indigo-500 to-purple-500" },
    { icon: BookOpen, title: "Master Concepts", desc: "Build a solid foundation for success", color: "from-pink-500 to-rose-500" },
  ]

  const testimonials = [
    { name: "Nisha P.", grade: "10th Grade", text: "I used to bomb my math tests. Now I get A's. It's kinda wild." },
    { name: "Anaad A.", grade: "College", text: "The AI explanations are better than my professor's lectures." },
    { name: "Kylie J.", grade: "8th Grade", text: "I don't hate math anymore, so I guess it's working? The game mode is actually fun." },
  ]

  const stats = [
    { icon: Calculator, value: "94.7%", label: "Student Improvement", desc: "Average grade increase" },
    { icon: TrendingUp, value: "2.5x", label: "Learning Speed", desc: "Faster concept mastery" },
    { icon: BookOpen, value: "300+", label: "Practice Problems", desc: "Practice makes perfect with a vast library of problems." },
  ]

  return (
    <div className="bg-white min-h-screen overflow-hidden">
      {/* Animated Background Elements (softened) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-[#6C63FF]/10 to-[#5E60CE]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-[#6C63FF]/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-br from-pink-400/10 to-[#6C63FF]/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-20 max-w-7xl">
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text text-sm font-semibold tracking-wider uppercase animate-pulse">
              The Future of Math Learning
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-8 pb-2 leading-tight">
            <span className="text-gray-900">Why choose</span>
            <br />
            <span className="bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] bg-clip-text text-transparent animate-gradient">
              MathStack AI
            </span>
            <span className="text-gray-900">?</span>
          </h1>
          
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-2xl md:text-3xl text-gray-700 mb-6 leading-relaxed font-light">
              Math doesn't have to be your <span className="text-red-400 line-through">enemy</span> 
              <span className="text-green-500 font-semibold ml-2">superpower</span>
            </p>
            <p className="text-xl text-gray-700 leading-relaxed">
              Transform from math anxiety to math mastery with AI that actually gets you.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto mb-32">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-8 pb-2">
            <span className="bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] bg-clip-text text-transparent">
              Features
            </span> designed for your success
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br from-[#f4f5ff] to-[#e9eafd] border border-[#6C63FF]/10 rounded-2xl p-8 shadow-lg transition-all duration-300 ${index === activeFeature ? 'scale-105' : ''}`}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-6`}>
                  {React.createElement(feature.icon, { className: "w-6 h-6" })}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-700">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-6xl mx-auto mb-32">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16 pb-2">
            The <span className="bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] bg-clip-text text-transparent">Numbers</span> Speak for Themselves
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gradient-to-br from-[#f4f5ff] to-[#e9eafd] border border-[#6C63FF]/10 rounded-2xl p-8 text-center shadow-lg">
                {React.createElement(stat.icon, { className: "w-10 h-10 mx-auto mb-4 text-[#6C63FF]" })}
                <div className="text-4xl font-bold text-gray-900 mb-2">{index === 0 ? animatedNumber.toFixed(1) + '%' : stat.value}</div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-gray-700">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="max-w-6xl mx-auto mb-32">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16 pb-2">
            What Our <span className="bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] bg-clip-text text-transparent">Students</span> Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-[#f4f5ff] to-[#e9eafd] border border-[#6C63FF]/10 rounded-2xl p-8 shadow-lg">
                <div className="mb-6">
                  <div className="text-lg font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-700">{testimonial.grade}</div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why MathStack AI Stands Apart Section */}
        <div className="max-w-4xl mx-auto px-4 text-center mb-32">
          <div className="bg-gradient-to-br from-[#f4f5ff] to-[#e9eafd] border border-[#6C63FF]/10 p-10 rounded-3xl shadow-xl transition-all duration-500">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12 pb-2">
              Why MathStack AI <span className="bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] bg-clip-text text-transparent">Stands Apart</span>
            </h2>
            
            <div className="space-y-8 text-left max-w-3xl mx-auto">
              <div className="bg-white/80 backdrop-blur-xl border border-[#6C63FF]/10 rounded-2xl p-8 hover:bg-white transition-all duration-300">
                <h3 className="text-2xl font-bold mb-3 flex items-center text-gray-900 tracking-tight">
                  Proactive Learning, Not Reactive Problem-Solving
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  While other tools help you solve the problem in front of you, MathStack AI helps you master the concepts behind it. Our Problem Lab generates unlimited practice problems so you build lasting understanding.
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-xl border border-[#6C63FF]/10 rounded-2xl p-8 hover:bg-white transition-all duration-300">
                <h3 className="text-2xl font-bold mb-3 flex items-center text-gray-900 tracking-tight">
                  True Personalization
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Most apps offer one-size-fits-all solutions. MathStack AI learns your strengths and weaknesses, creating custom problem sets that target exactly what you need to improve.
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-xl border border-[#6C63FF]/10 rounded-2xl p-8 hover:bg-white transition-all duration-300">
                <h3 className="text-2xl font-bold mb-3 flex items-center text-gray-900 tracking-tight">
                  Learning That's Actually Engaging
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Math doesn't have to be boring. Our Brainiac game makes mental math practice fun and competitive, while detailed progress tracking keeps you motivated.
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-xl border border-[#6C63FF]/10 rounded-2xl p-8 hover:bg-white transition-all duration-300">
                <h3 className="text-2xl font-bold mb-3 flex items-center text-gray-900 tracking-tight">
                  Next-Generation AI
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Powered by Google's most advanced AI model, MathStack AI doesn't just solve problems—it understands mathematical reasoning and explains concepts in ways that make sense to you.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-br from-[#f4f5ff] to-[#e9eafd] border border-[#6C63FF]/10 rounded-3xl p-16 shadow-2xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] text-white mb-8">
              <Sparkles className="w-8 h-8" />
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 pb-2">
              Ready to Transform Your
              <br />
              <span className="text-transparent bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] bg-clip-text">
                Math Journey?
              </span>
            </h2>
            
            <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
              Join thousands of students who've already discovered that math can be their strongest subject.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          background-size: 300% 300%;
          animation: gradient 8s ease infinite;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
