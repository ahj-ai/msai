'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SignedIn, SignedOut, SignUpButton } from '@clerk/nextjs';
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
                Built for Math.<br />
                <span className="animate-gradient-x bg-gradient-to-r from-[#6C63FF] via-[#8A6FFD] to-[#5E60CE] bg-clip-text text-transparent text-hover-animate">Built for You.</span>
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
                MathStack AI gives you results—not walls of text. Get instant step-by-step solutions, master speed with Brainiac, and practice unlimited problems in the Problem Lab.
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

        {/* Features Section */}
        <section className="section bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="font-display text-4xl font-bold mb-6 tracking-tight">Built for Math Mastery</h2>
              <p className="font-body text-xl text-gray-600 leading-relaxed">While ChatGPT tries to do everything, we do one thing perfectly: make you a math genius.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} link="/why-mathstack-ai" />
              ))}
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