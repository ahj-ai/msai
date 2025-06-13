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

        {/* Comparison Section */}
        <div className="max-w-6xl mx-auto px-4 mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">Why MathStack AI Stands Apart</h2>

          {/* Subsection: What Makes MathStack AI Different */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">What Makes MathStack AI Different</h3>
            <div className="space-y-8">
              <div>
                <h4 className="text-xl font-semibold mb-2 text-gray-900">🎯 Proactive Learning, Not Reactive Problem-Solving</h4>
                <p className="text-gray-600 leading-relaxed">While other tools help you solve the problem in front of you, MathStack AI helps you master the concepts behind it. Our Problem Lab generates unlimited practice problems so you build lasting understanding.</p>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2 text-gray-900">🧠 True Personalization</h4>
                <p className="text-gray-600 leading-relaxed">Most apps offer one-size-fits-all solutions. MathStack AI learns your strengths and weaknesses, creating custom problem sets that target exactly what you need to improve.</p>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2 text-gray-900">🎮 Learning That's Actually Engaging</h4>
                <p className="text-gray-600 leading-relaxed">Math doesn't have to be boring. Our Brainiac game makes mental math practice fun and competitive, while detailed progress tracking keeps you motivated.</p>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2 text-gray-900">🤖 Next-Generation AI</h4>
                <p className="text-gray-600 leading-relaxed">Powered by Google's most advanced AI model, MathStack AI doesn't just solve problems—it understands mathematical reasoning and explains concepts in ways that make sense to you.</p>
              </div>
            </div>
          </div>

          {/* Subsection: The Bottom Line */}
          <div className="bg-indigo-50 p-8 rounded-2xl text-center">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">The Bottom Line</h3>
            <p className="text-xl text-gray-700 mb-6"><strong>Other tools solve your homework. MathStack AI builds your math confidence.</strong></p>
            <p className="text-gray-600 leading-relaxed">Choose MathStack AI if you want to actually understand and master math, not just get through your assignments.</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-2xl mx-auto px-4 text-center mb-24">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-10 rounded-2xl shadow-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to see the difference?</h2>
            <p className="text-xl text-indigo-100 mb-8">Join thousands of students who have improved their math skills with MathStack AI</p>
            <a href="/signup" className="inline-block bg-white text-indigo-600 hover:bg-gray-100 text-lg font-semibold px-8 py-4 rounded-full shadow-md transition-colors">
              Try MathStack AI Free
            </a>
            <p className="text-indigo-100 text-sm mt-4">No credit card required • Cancel anytime</p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

