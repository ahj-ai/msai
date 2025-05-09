"use client"

import React from 'react'
import { SectionTitle } from "@/components/SectionTitle"

import { PageLayout } from "@/components/PageLayout";

export function WhyMathStackAI() {
  return (
    <PageLayout showNavFooter={true}>
      <div className="text-center">
        <SectionTitle
          title="Why MathStack AI?"
          subtitle="Math can be tough, we get it. But what if learning math could be different? What if it could be... fun? That's where MathStack AI comes in. MathStack AI isn't just another math program. It's your personalized AI-powered learning partner, designed to help you succeed."
        />

        {/* Features Grid (2 rows) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-[#4B2E83] p-8 rounded-lg text-center">
            <div className="w-16 h-16 mx-auto mb-6">
              <svg viewBox="0 0 24 24" className="w-full h-full text-[#E5A0E5]" fill="currentColor">
                <path d="M13 3c3.88 0 7 3.14 7 7 0 2.8-1.63 5.19-4 6.31V21H9v-3H8c-1.11 0-2-.89-2-2v-3H4.69c-.95-.31-1.63-1.19-1.69-2.25A2.5 2.5 0 0 1 5.5 8H6V7c0-2.21 1.79-4 4-4h3m0-2H9C5.13 1 2 4.13 2 8v.29C.84 9.83 0 11.53 0 13.5 0 16.54 2.46 19 5.5 19H6v2c0 2.21 1.79 4 4 4h4c1.11 0 2-.89 2-2v-4.54c3.55-1.73 6-5.37 6-9.46 0-5.52-4.48-10-10-10Z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Finally understand math
            </h2>
            <p className="text-gray-300">
              Break down tricky concepts into easy-to-grasp steps with visuals and interactive examples.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#4B2E83] p-8 rounded-lg text-center">
            <div className="w-16 h-16 mx-auto mb-6">
              <svg viewBox="0 0 24 24" className="w-full h-full text-[#E5A0E5]" fill="currentColor">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Learn at your pace
            </h2>
            <p className="text-gray-300">
              Our AI adapts to your individual learning style and speed, providing personalized practice.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#4B2E83] p-8 rounded-lg text-center">
            <div className="w-16 h-16 mx-auto mb-6">
              <svg viewBox="0 0 24 24" className="w-full h-full text-[#E5A0E5]" fill="currentColor">
                <path d="M12 2L4 8v12h16V8l-8-6zm-3 15H7v-6h2v6zm4 0h-2v-8h2v8zm4 0h-2v-4h2v4z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Make practice fun
            </h2>
            <p className="text-gray-300">
              Engage with adaptive math games that make practicing feel like playing, earning rewards as you progress.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-[#4B2E83] p-8 rounded-lg text-center">
            <div className="w-16 h-16 mx-auto mb-6">
              {/* Target Icon */}
              <svg viewBox="0 0 24 24" className="w-full h-full text-[#E5A0E5]" fill="currentColor">
                <circle cx="12" cy="12" r="10" stroke="#E5A0E5" strokeWidth="2" fill="none" />
                <circle cx="12" cy="12" r="6" stroke="#E5A0E5" strokeWidth="2" fill="none" />
                <circle cx="12" cy="12" r="2" fill="#E5A0E5" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Stay on track
            </h2>
            <p className="text-gray-300">
              Access 24/7 to catch up on missed lessons or get extra practice whenever you need it.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-[#4B2E83] p-8 rounded-lg text-center">
            <div className="w-16 h-16 mx-auto mb-6">
              {/* Medal/Certificate Icon */}
              <svg viewBox="0 0 24 24" className="w-full h-full text-[#E5A0E5]" fill="currentColor">
                <circle cx="12" cy="8" r="6" stroke="#E5A0E5" strokeWidth="2" fill="none" />
                <rect x="9" y="14" width="6" height="7" rx="1" fill="#E5A0E5" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Build real confidence
            </h2>
            <p className="text-gray-300">
              Master new skills and see your progress, boosting your confidence in math abilities.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-[#4B2E83] p-8 rounded-lg text-center">
            <div className="w-16 h-16 mx-auto mb-6">
              {/* Lightning/Brain Icon */}
              <svg viewBox="0 0 24 24" className="w-full h-full text-[#E5A0E5]" fill="currentColor">
                <path d="M13 2L3 14h7v8l10-12h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Master the concepts
            </h2>
            <p className="text-gray-300">
              Ensure you learn the core concepts, building a strong foundation for math success.
            </p>
          </div>
        </div>

        {/* How does the AI work section */}
        <div className="max-w-4xl mx-auto mt-24 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#E5A0E5]">How does the AI work?</h2>
          <p className="text-xl text-gray-200 mb-8">
            Think of it like having a super-smart tutor who's always there to help. Our AI constantly analyzes how you're doing and adjusts the lessons and problems to match your needs. It's like having a personalized learning plan designed just for you.
          </p>
        </div>

        {/* CTA Section */}
        <div className="max-w-2xl mx-auto mt-20 mb-24 text-center">
          <p className="text-xl text-gray-200 mb-2">We're passionate about making math fun and accessible for all students</p>
          <p className="text-3xl md:text-4xl font-bold mb-8 text-white">Ready to see the difference?</p>
          <a href="/signup">
            <button className="bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold px-8 py-4 rounded-full shadow-lg transition-colors">
              Try MathStack AI Free
            </button>
          </a>
        </div>

        {/* Testimonials Section */}
        <div className="max-w-6xl mx-auto mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-[#E5A0E5] text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-[#3B2254] p-8 rounded-xl flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#4B2E83] flex items-center justify-center mb-4">
                {/* Placeholder User Icon */}
                <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#E5A0E5]" fill="currentColor">
                  <circle cx="12" cy="8" r="4" />
                  <rect x="6" y="14" width="12" height="6" rx="3" />
                </svg>
              </div>
              <div className="mb-2">
                <span className="font-bold text-white">Emily R.</span>
                <div className="text-purple-200 text-sm">High School Student</div>
              </div>
              <p className="text-gray-200 text-base mt-2">"MathStack AI turned math from my worst subject to my best. The personalized practice really works!"</p>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-[#3B2254] p-8 rounded-xl flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#4B2E83] flex items-center justify-center mb-4">
                {/* Placeholder User Icon */}
                <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#E5A0E5]" fill="currentColor">
                  <circle cx="12" cy="8" r="4" />
                  <rect x="6" y="14" width="12" height="6" rx="3" />
                </svg>
              </div>
              <div className="mb-2">
                <span className="font-bold text-white">Mr. Johnson</span>
                <div className="text-purple-200 text-sm">Math Teacher</div>
              </div>
              <p className="text-gray-200 text-base mt-2">"I've seen a remarkable improvement in my students' understanding and engagement since using MathStack AI."</p>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-[#3B2254] p-8 rounded-xl flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#4B2E83] flex items-center justify-center mb-4">
                {/* Placeholder User Icon */}
                <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#E5A0E5]" fill="currentColor">
                  <circle cx="12" cy="8" r="4" />
                  <rect x="6" y="14" width="12" height="6" rx="3" />
                </svg>
              </div>
              <div className="mb-2">
                <span className="font-bold text-white">Sarah L.</span>
                <div className="text-purple-200 text-sm">Parent</div>
              </div>
              <p className="text-gray-200 text-base mt-2">"My daughter's confidence in math has skyrocketed. MathStack AI has been a game-changer for our family."</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

