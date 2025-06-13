"use client"

import React from 'react'
import { Brain, Clock, Target, Award, Zap, BookOpen } from 'lucide-react';
import { PageLayout } from "@/components/PageLayout";

export function WhyMathStackAI() {
  return (
    <PageLayout showNavFooter={true}>
      <div className="bg-gradient-to-b from-white to-[#F8F9FB] min-h-screen">
        <div className="container mx-auto px-4 py-20 max-w-6xl">
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Why choose <span className="bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] bg-clip-text text-transparent">MathStack AI</span>?
            </h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Math can be tough, we get it. But what if learning math could be different? What if it could be... fun?
              </p>
              <p className="text-xl text-gray-600 leading-relaxed">
                That's where MathStack AI comes in. It's not just another math program - it's your personalized AI-powered learning partner, designed to help you succeed.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {/* Feature 1 */}
            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 flex items-center justify-center bg-indigo-50 rounded-xl mb-6 mx-auto">
                <Brain className="w-6 h-6 text-[#6C63FF]" />
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                Finally understand math
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Break down tricky concepts into easy-to-grasp steps with visuals and interactive examples.
              </p>
            </div>

          {/* Feature 2 */}
          <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 flex items-center justify-center bg-indigo-50 rounded-xl mb-6 mx-auto">
              <Clock className="w-6 h-6 text-[#6C63FF]" />
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Learn at your own pace
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Our AI adapts to your individual learning style and speed, providing personalized practice that fits your schedule.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 flex items-center justify-center bg-indigo-50 rounded-xl mb-6 mx-auto">
              <Zap className="w-6 h-6 text-[#6C63FF]" />
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Make practice fun
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Engage with adaptive math games that make practicing feel like playing, earning rewards as you progress.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 flex items-center justify-center bg-indigo-50 rounded-xl mb-6 mx-auto">
              <Target className="w-6 h-6 text-[#6C63FF]" />
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Stay on track
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Access 24/7 to catch up on missed lessons or get extra practice whenever you need it most.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 flex items-center justify-center bg-indigo-50 rounded-xl mb-6 mx-auto">
              <Award className="w-6 h-6 text-[#6C63FF]" />
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Build real confidence
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Master new skills and see your progress, boosting your confidence in math abilities.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 flex items-center justify-center bg-indigo-50 rounded-xl mb-6 mx-auto">
              <BookOpen className="w-6 h-6 text-[#6C63FF]" />
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Master the concepts
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Ensure you learn the core concepts, building a strong foundation for math success.
            </p>
          </div>
        </div>

        </div>

        {/* How AI Works Section */}
        <div className="max-w-4xl mx-auto px-4 text-center mb-24">
          <div className="bg-white p-10 rounded-2xl shadow-sm">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">How does the AI work?</h2>
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
              <p>
                Think of it like having an expert math tutor available 24/7. When you're stuck on a tricky problem, our AI is there to provide instant, detailed help. Just type in your question or upload a photo of the problem.
              </p>
              <p>
                Instead of just giving you the answer, MathStackAI breaks down the solution into clear, step-by-step explanations. It's designed to help you understand the underlying concepts, so you're not just solving one problem—you're building the skills to tackle any problem.
              </p>
            </div>
          </div>
        </div>

        {/* Why MathStack AI Stands Apart */}
        <div className="max-w-4xl mx-auto px-4 text-center mb-24">
          <div className="bg-white p-10 rounded-2xl shadow-sm">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Why MathStack AI Stands Apart</h2>
            
            <div className="space-y-10 text-left max-w-3xl mx-auto">
              <div>
                <h3 className="text-2xl font-semibold mb-3 flex items-center text-gray-900">
                  <span className="text-[#6C63FF] mr-2">🎯</span> Proactive Learning, Not Reactive Problem-Solving
                </h3>
                <p className="text-gray-600 text-lg">
                  While other tools help you solve the problem in front of you, MathStack AI helps you master the concepts behind it. Our Problem Lab generates unlimited practice problems so you build lasting understanding.
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold mb-3 flex items-center text-gray-900">
                  <span className="text-[#6C63FF] mr-2">🧠</span> True Personalization
                </h3>
                <p className="text-gray-600 text-lg">
                  Most apps offer one-size-fits-all solutions. MathStack AI learns your strengths and weaknesses, creating custom problem sets that target exactly what you need to improve.
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold mb-3 flex items-center text-gray-900">
                  <span className="text-[#6C63FF] mr-2">🎮</span> Learning That's Actually Engaging
                </h3>
                <p className="text-gray-600 text-lg">
                  Math doesn't have to be boring. Our Brainiac game makes mental math practice fun and competitive, while detailed progress tracking keeps you motivated.
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold mb-3 flex items-center text-gray-900">
                  <span className="text-[#6C63FF] mr-2">🤖</span> Next-Generation AI
                </h3>
                <p className="text-gray-600 text-lg">
                  Powered by Google's most advanced AI model, MathStack AI doesn't just solve problems—it understands mathematical reasoning and explains concepts in ways that make sense to you.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Line Section */}
        <div className="max-w-5xl mx-auto px-4 mb-24">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-12 rounded-2xl shadow-xl text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-10">The Bottom Line</h2>
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-center mb-8">
                <p className="text-2xl md:text-3xl text-white font-medium md:mr-4 mb-4 md:mb-0">
                  Other tools solve your homework.
                </p>
                <div className="bg-white py-3 px-5 rounded-lg shadow-md transform md:translate-y-0 hover:scale-105 transition-all">
                  <p className="text-2xl md:text-3xl text-indigo-600 font-bold">
                    MathStack AI builds your math confidence.
                  </p>
                </div>
              </div>
              <p className="text-xl text-white mb-10 max-w-2xl mx-auto">
                Choose MathStack AI if you want to actually understand and master math, not just get through your assignments.
              </p>
              <a href="/signup" className="inline-block bg-white text-indigo-600 hover:bg-indigo-50 text-lg font-semibold px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                Get Started Today
              </a>
            </div>
          </div>
        </div>


      </div>
    </PageLayout>
  )
}

