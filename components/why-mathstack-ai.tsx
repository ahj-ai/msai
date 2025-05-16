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
                Think of it like having a super-smart tutor who's always there to help. Our AI constantly analyzes how you're doing and adjusts the lessons and problems to match your needs.
              </p>
              <p>
                It's like having a personalized learning plan designed just for you, adapting in real-time to your strengths and areas that need more practice.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-7xl mx-auto px-4 mb-24">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">What students and teachers say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-6">"MathStack AI turned math from my worst subject to my best. The personalized practice really works!"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <p className="font-medium text-gray-900">Emily R.</p>
                  <p className="text-sm text-gray-500">High School Student</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-6">"I've seen a remarkable improvement in my students' understanding and engagement since using MathStack AI."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <p className="font-medium text-gray-900">Mr. Johnson</p>
                  <p className="text-sm text-gray-500">Math Teacher</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-6">"My daughter's confidence in math has skyrocketed. MathStack AI has been a game-changer for our family."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <p className="font-medium text-gray-900">Sarah L.</p>
                  <p className="text-sm text-gray-500">Parent</p>
                </div>
              </div>
            </div>
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

