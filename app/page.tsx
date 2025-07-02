'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SignedIn, SignedOut, SignUpButton } from '@clerk/nextjs';
// Images referenced directly from public folder
import { RedirectToDashboard } from '../components/redirect-to-dashboard';
import { FeatureCard } from '../components/feature-card';
import { Brain, Zap, Target, Award, ArrowRight, CheckCircle, XCircle, Trophy } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// ComparisonTable component removed as requested

function TestimonialCard({ quote, name, role }: {
  quote: string;
  name: string;
  role: string;
}) {
  return (
    <div className="border border-white/10 p-8 rounded-lg bg-white/5 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 rhythm-y">
      <p className="font-body text-high-contrast-light text-white/95 mb-6 leading-relaxed relative">
        <span className="font-display text-[#B619E7] text-2xl absolute -left-3 -top-2 font-bold">"</span>
        {quote}
        <span className="font-display text-[#B619E7] text-2xl font-bold">"</span>
      </p>
      <div className="flex items-center mt-6">
        <div className="w-12 h-12 bg-[#B619E7]/20 rounded-full mr-4 border border-[#B619E7]/30 transition-all duration-300 hover:bg-[#B619E7]/30 text-hover-animate"></div>
        <div>
          <div className="font-display font-semibold text-white tracking-tight text-hover-animate">{name}</div>
          <div className="font-body text-white/80 text-sm tracking-relaxed">{role}</div>
        </div>
      </div>
    </div>
  );
}



export default function Home() {
  const [mathProblem, setMathProblem] = useState("2x + 5 = 13");
  const [showSolution, setShowSolution] = useState(false);
  
  const features: Feature[] = [
    {
      icon: <Zap className="w-8 h-8 text-[#6C63FF]" />,
      title: 'Instant Math Solutions',
      description: 'Get step-by-step solutions in seconds, not minutes. Our AI shows its work so you learn the process.'
    },
    {
      icon: <Target className="w-8 h-8 text-[#6C63FF]" />,
      title: 'Laser-Focused Training',
      description: 'Built exclusively for math. No generic responses—every feature designed to master mathematical concepts.'
    },
    {
      icon: <Trophy className="w-8 h-8 text-[#6C63FF]" />,
      title: 'Gamified Practice',
      description: 'Turn practice into play with the Brainiac speed game. Build fluency while having fun.'
    },
    {
      icon: <Brain className="w-8 h-8 text-[#6C63FF]" />,
      title: 'Smart Progress Tracking',
      description: 'See exactly where you improve and what needs work. Unlike ChatGPT, we remember your journey.'
    }
  ];

  const comparisonFeatures = [
    { feature: 'Step-by-Step Explanations', mathstack: true, gpt: 'Sometimes' },
    { feature: 'Structured Practice (Problem Lab)', mathstack: true, gpt: false },
    { feature: 'Gamified Learning (Brainiac)', mathstack: true, gpt: false },
    { feature: 'Personalized Progress Tracking', mathstack: true, gpt: false },
    { feature: 'AI Fine-Tuned for Math Tutoring', mathstack: true, gpt: false },
  ];

  return (
    <>
      <SignedIn>
        <RedirectToDashboard />
      </SignedIn>
      <SignedOut>
        <div className="overflow-hidden">
        {/* Hero Section */}
        <section className="section">
          <div className="container">
            <div className="max-w-5xl mx-auto text-center">

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 pb-2 tracking-tight">
  Your Personal AI <span className="animate-gradient-x bg-gradient-to-r from-[#6C63FF] via-[#8A6FFD] to-[#5E60CE] bg-clip-text text-transparent text-hover-animate">Math Tutor</span>
</h1>
              <style jsx>{`
                @keyframes gradient-x {
                  0% {
                    background-position: 0% 50%;
                  }
                  50% {
                    background-position: 100% 50%;
                  }
                  100% {
                    background-position: 0% 50%;
                  }
                }
                .animate-gradient-x {
                  background-size: 200% 200%;
                  animation: gradient-x 8s ease infinite;
                }
              `}</style>
              <p className="font-body text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
  Stop wrestling with generic AI. Get instant, step-by-step solutions, master concepts with gamified practice, and tackle any problem with a photo.
</p>

              {/* Social proof */}
              <div className="flex flex-wrap justify-center items-center gap-6 mb-10 text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="flex -space-x-2 mr-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-gradient-to-r from-[#8A6FFD] to-[#6C63FF] rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-gradient-to-r from-[#5E60CE] to-[#8A6FFD] rounded-full border-2 border-white"></div>
                  </div>
                  <span className="font-body font-medium tracking-tight">🚀 <span className="font-mono">2x</span> faster learning</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <SignUpButton mode="modal">
                  <button 
                    className="btn-primary inline-flex items-center justify-center px-8 py-4 text-lg font-display font-bold text-white relative overflow-hidden group transition-all duration-300 hover:-translate-y-1"
                  >
                    <span className="relative z-10 tracking-tight">Start free trial</span>
                    <ArrowRight className="ml-2 w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8A6FFD] to-[#6C63FF] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                </SignUpButton>
                <Link 
                  href="/why-mathstack-ai" 
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-display font-semibold tracking-tight text-[#6C63FF] hover:bg-[#6C63FF]/5 rounded-full transition-all duration-300 hover:-translate-y-1 border-2 border-[#6C63FF]/20 hover:border-[#6C63FF]/40 text-hover-animate"
                >
                  See the difference <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="section bg-gray-50">
            <div className="container rhythm-y-lg">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 tracking-tight text-high-contrast">The MathStackAI Difference</h2>
                    <p className="font-body text-xl text-gray-600 leading-relaxed">A purpose-built learning platform will always beat a generic chatbot. Here's why.</p>
                </div>
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 divide-y divide-gray-200 hover:shadow-xl transition-all duration-300">
                        <div className="grid grid-cols-3 gap-4 p-4 font-display font-bold text-gray-800 tracking-tight">
                            <div className="text-left">Feature</div>
                            <div className="text-center">MathStackAI</div>
                            <div className="text-center">Generic AI</div>
                        </div>
                        {comparisonFeatures.map((item) => (
                            <div key={item.feature} className="grid grid-cols-3 gap-4 p-4 text-center items-center hover:bg-gray-50 transition-colors">
                                <div className="text-left font-display font-semibold text-gray-700 tracking-tight">{item.feature}</div>
                                <div className="text-hover-animate">
                                    <CheckCircle className="h-6 w-6 text-green-500 mx-auto" />
                                </div>
                                <div className="text-hover-animate">
                                    {item.gpt === true ? <CheckCircle className="h-6 w-6 text-green-500 mx-auto" /> : item.gpt === false ? <XCircle className="h-6 w-6 text-red-400 mx-auto" /> : <span className="font-body text-sm text-gray-500 italic tracking-relaxed">{item.gpt}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Comparison table removed as requested */}
                </div>
            </div>
        </section>

        {/* New Feature Sections */}
        <section className="section bg-white">
          <div className="container">
            {/* Brainiac Feature */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
              <div className="text-center md:text-left">
                <h3 className="font-display text-lg font-semibold text-[#6C63FF] mb-2 tracking-wide">The Mental Math Speed Game</h3>
                <h2 className="font-display text-4xl font-extrabold mb-4 tracking-tight">Brainiac</h2>
                <p className="font-body text-lg text-gray-600 leading-relaxed">
                  Race against the clock to solve math problems, improve your speed and accuracy, and climb the leaderboard. While other apps make math feel like a chore, Brainiac makes practice fun and competitive. The engaging, game-like experience keeps you motivated with detailed progress tracking.
                </p>
              </div>
              <div className="max-w-5xl mx-auto">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      {/* Image 1: Gameplay */}
                      <div className="w-full h-auto">
                          <Image
                              src="/images/brainiac-gameplay.jpeg"
                              alt="The Brainiac math game screen showing a problem and user stats."
                              width={500}
                              height={550}
                              className="rounded-xl shadow-md border border-white"
                              priority
                          />
                      </div>
                      {/* Image 2: Results */}
                      <div className="w-full h-auto">
                          <Image
                              src="/images/brainiac-results.jpeg"
                              alt="The Brainiac final score screen showing statistics like accuracy, time, and streak."
                              width={500}
                              height={550}
                              className="rounded-xl shadow-md border border-white"
                              priority
                          />
                      </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Problem Lab Main Section */}
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl font-extrabold mb-4 tracking-tight">The Problem Lab: Your All-in-One Math Hub</h2>
              <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                The Problem Lab is your central command for mastering math. Unlike generic AI tools that only react to questions, our Problem Lab proactively helps you build lasting understanding through personalized practice and targeted support.
              </p>
            </div>

            {/* Sub-feature: Practice Hub */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="text-center md:text-left">
                <h3 className="font-display text-2xl font-bold mb-3 tracking-tight">Practice Hub: Your Unlimited Playground</h3>
                <p className="font-body text-lg text-gray-600 leading-relaxed">
                  Generate unlimited practice problems for any math concept. The Problem Lab learns your strengths and weaknesses, creating custom problem sets that target exactly what you need to improve — true personalization, not one-size-fits-all solutions.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg bg-white p-4 space-y-4 border border-gray-200">
                {/* --- Visual Placeholder --- */}
                
                {/* Placeholder for the first image: The Practice Hub selection */}
                <div className="bg-gradient-to-r from-[#8A6FFD] to-[#6C63FF] p-6 rounded-xl text-white">

                    <div className="bg-white/25 p-3 rounded-lg mb-3 font-medium">Subject: Pre-Algebra</div>
                    <div className="bg-white/25 p-3 rounded-lg font-medium">Topic: Select a topic...</div>
                    <div className="bg-white text-center text-[#6C63FF] font-bold py-3 mt-5 rounded-lg shadow-md">Try a Problem →</div>
                </div>

                {/* Placeholder for the second image: The practice problem itself */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
                    <h4 className="font-bold text-xl text-gray-800 mb-2">Practice Problem</h4>
                    <p className="text-gray-600 mb-4">Evaluate the expression <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md">5y - 10</code> when <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md">y = 3</code>.</p>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex-grow p-3 border rounded-lg text-gray-500">Enter your answer</div>
                        <div className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg">Check</div>
                    </div>
                    <div className="flex justify-center gap-4">
                        <button className="text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-lg transition-colors">Get a Hint</button>
                        <button className="text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-lg transition-colors">Show Solution</button>
                    </div>
                </div>
              </div>
            </div>

            {/* Sub-feature: Ask the AI */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="rounded-lg overflow-hidden md:order-last">
                <Image
                  src="/images/askthelab.png"
                  alt="Ask the Lab interface showing a math equation solver"
                  width={650}
                  height={400}
                  className="w-full h-auto shadow-lg border border-gray-100 rounded-lg"
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="font-display text-2xl font-bold mb-3 tracking-tight">Ask the AI: Your 24/7 Math Expert</h3>
                <p className="font-body text-lg text-gray-600 leading-relaxed">
                  Stuck on a problem? Use the integrated 'Ask the AI' to get unstuck with hints or full step-by-step solutions. Powered by Google's most advanced AI model, it doesn't just solve problems—it understands mathematical reasoning and explains concepts in ways that make sense to you.
                </p>
              </div>
            </div>

            {/* Sub-feature: Snap and Solve */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-left">
                <h3 className="font-display text-2xl font-bold mb-3 tracking-tight">Snap and Solve: Your Camera is Your Calculator</h3>
                <p className="font-body text-lg text-gray-600 leading-relaxed">
                  Don't know how to type that tricky integral or matrix? Just take a picture. Snap and Solve digitizes the problem and gives you a complete solution.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/images/snap&solve.png"
                  alt="Screenshot and Solve feature interface"
                  width={650}
                  height={400}
                  className="w-full h-auto shadow-lg border border-gray-100 rounded-lg"
                />
              </div>
            </div>

            {/* Sub-feature: Generate Similar Problem */}
            <div className="grid md:grid-cols-2 gap-12 items-center mt-20">
              <div className="rounded-lg overflow-hidden md:order-last">
                <Image
                  src="/images/lab-analysis.png"
                  alt="Lab's Analysis showing step-by-step math solutions"
                  width={650}
                  height={550}
                  className="w-full h-auto shadow-lg border border-gray-100 rounded-lg"
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="font-display text-2xl font-bold mb-3 tracking-tight">Generate Similar Problems: Master Any Concept</h3>
                <p className="font-body text-lg text-gray-600 leading-relaxed">
                  Once you've solved a problem, our AI can generate similar problems that reinforce the same concept but with different values and scenarios. This spaced repetition approach helps you build true mastery through targeted practice.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <div className="bg-[#6C63FF]/10 text-[#6C63FF] py-2 px-4 rounded-lg font-medium text-sm flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9Z"/><path d="m9 15 6-6"/><path d="M11 15h4v-4"/></svg>
                    Generate Similar Problem
                  </div>
                  <div className="bg-[#6C63FF]/10 text-[#6C63FF] py-2 px-4 rounded-lg font-medium text-sm flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    Show Solution
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Numbers Speak for Themselves Section */}
        <section className="section bg-gray-50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl font-extrabold mb-4 tracking-tight">
                The <span className="text-[#6C63FF]">Numbers</span> Speak for Themselves
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Stat Card 1 */}
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-[#6C63FF]/10 rounded-full flex items-center justify-center">
                    <span className="text-[#6C63FF]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/><rect x="2" y="7" width="20" height="4" rx="2"/><path d="M12 5V3"/><path d="M10 9h4"/></svg>
                    </span>
                  </div>
                </div>
                <h3 className="font-display text-4xl font-extrabold mb-2">94.7%</h3>
                <div className="font-bold text-gray-800 mb-1">Student Improvement</div>
                <p className="text-gray-600 text-sm">Average grade increase</p>
              </div>
              
              {/* Stat Card 2 */}
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-[#6C63FF]/10 rounded-full flex items-center justify-center">
                    <span className="text-[#6C63FF]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                    </span>
                  </div>
                </div>
                <h3 className="font-display text-4xl font-extrabold mb-2">2.5x</h3>
                <div className="font-bold text-gray-800 mb-1">Learning Speed</div>
                <p className="text-gray-600 text-sm">Faster concept mastery</p>
              </div>
              
              {/* Stat Card 3 */}
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-[#6C63FF]/10 rounded-full flex items-center justify-center">
                    <span className="text-[#6C63FF]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                    </span>
                  </div>
                </div>
                <h3 className="font-display text-4xl font-extrabold mb-2">300+</h3>
                <div className="font-bold text-gray-800 mb-1">Practice Problems</div>
                <p className="text-gray-600 text-sm">Practice makes perfect with a vast library of problems.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="section">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl font-extrabold mb-4 tracking-tight">
                What Our <span className="text-[#6C63FF]">Students</span> Say
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-gray-50 p-8 rounded-xl hover:shadow-md transition-shadow">
                <h3 className="font-display font-bold text-xl mb-1">Nisha P.</h3>
                <p className="text-gray-600 mb-4 text-sm">10th Grade</p>
                <p className="italic text-gray-700">
                  "I used to bomb my math tests. Now I get A's. It's kinda wild."
                </p>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-gray-50 p-8 rounded-xl hover:shadow-md transition-shadow">
                <h3 className="font-display font-bold text-xl mb-1">Anaad A.</h3>
                <p className="text-gray-600 mb-4 text-sm">College</p>
                <p className="italic text-gray-700">
                  "The AI explanations are better than my professor's lectures."
                </p>
              </div>
              
              {/* Testimonial 3 */}
              <div className="bg-gray-50 p-8 rounded-xl hover:shadow-md transition-shadow">
                <h3 className="font-display font-bold text-xl mb-1">Kylie J.</h3>
                <p className="text-gray-600 mb-4 text-sm">8th Grade</p>
                <p className="italic text-gray-700">
                  "I don't hate math anymore, so I guess it's working? The game mode is actually fun."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section bg-gray-900 text-white">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block mb-6 bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] px-4 py-2 rounded-full text-white">
                <span className="flex items-center font-body font-medium tracking-tight"><Zap className="w-4 h-4 mr-2" /> Get <span className="font-mono mx-1">25</span> Free Stacks on Sign-Up</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Stop Struggling with Math Today</h2>
              <p className="font-body text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">Start mastering math concepts <span className="font-mono font-medium">2x</span> faster than with traditional methods.</p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-6 mb-8">
                <SignedOut>
                  <SignUpButton mode="modal">
                    <button className="btn btn-primary text-lg px-8 py-4 bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] hover:from-[#5E60CE] hover:to-[#6C63FF] transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl font-display font-bold tracking-tight text-hover-animate hover:-translate-y-1">
                      Get Started for Free
                    </button>
                  </SignUpButton>
                  <Link href="/why-mathstack-ai" className="btn btn-outline text-lg px-8 py-4 border-2 border-white/30 hover:bg-white/10 transition-all duration-300 rounded-xl flex items-center justify-center font-display font-medium tracking-tight text-hover-animate hover:-translate-y-1">
                    <span>See How It Works</span> <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </SignedOut>
              </div>
              
              <div className="font-body text-sm text-gray-400 tracking-tight">No credit card required.</div>
            </div>
          </div>
        </section>
      </div>
      </SignedOut>
    </>
  );
}