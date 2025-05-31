'use client';

import Link from 'next/link';
import { SignedIn, SignedOut, SignUpButton } from '@clerk/nextjs';
import { RedirectToDashboard } from '../components/redirect-to-dashboard';
import { FeatureCard } from '../components/feature-card';
import { Brain, Lightbulb, Rocket, Sparkles, ArrowRight } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

function ComparisonTable() {
  const features = [
    { name: 'Mental Math Game', free: true, premium: true },
    { name: 'Custom Problem Sets', free: true, premium: true },
    { name: 'Personalized Insights', free: false, premium: true },
    { name: 'Leaderboards & Badges', free: false, premium: true },
    { name: 'AI-Generated Features', free: false, premium: true },
  ];

  return (
    <div className="mb-8">
      <div className="grid grid-cols-3 gap-4 mb-4 text-sm font-semibold">
        <div>Feature</div>
        <div>Free Version</div>
        <div>Premium Version</div>
      </div>
      {features.map((feature) => (
        <div key={feature.name} className="grid grid-cols-3 gap-4 py-2 border-t border-gray-800">
          <div>{feature.name}</div>
          <div>{feature.free ? '✓' : '×'}</div>
          <div>{feature.premium ? '✓' : '×'}</div>
        </div>
      ))}
    </div>
  );
}

function TestimonialCard({ quote, name, role }: {
  quote: string;
  name: string;
  role: string;
}) {
  return (
    <div className="border border-white/10 p-8 rounded-lg bg-white/5">
      <p className="text-white/90 mb-6 leading-relaxed relative">
        <span className="text-[#B619E7] text-xl absolute -left-3 -top-2">“</span>
        {quote}
        <span className="text-[#B619E7] text-xl">”</span>
      </p>
      <div className="flex items-center mt-6">
        <div className="w-12 h-12 bg-[#B619E7]/20 rounded-full mr-4 border border-[#B619E7]/30"></div>
        <div>
          <div className="font-semibold text-white">{name}</div>
          <div className="text-white/70 text-sm">{role}</div>
        </div>
      </div>
    </div>
  );
}



export default function Home() {
  const features: Feature[] = [
    {
      icon: <Brain className="w-8 h-8 text-[#6C63FF]" />,
      title: 'AI-Powered Learning',
      description: 'Get personalized math guidance from our advanced AI tutor that adapts to your learning style.',
      link: '/why-mathstack-ai#ai-learning'
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-[#6C63FF]" />,
      title: 'Concept Mastery',
      description: 'Master difficult concepts with step-by-step explanations and interactive problem-solving.',
      link: '/why-mathstack-ai#concept-mastery'
    },
    {
      icon: <Rocket className="w-8 h-8 text-[#6C63FF]" />,
      title: 'Practice Makes Perfect',
      description: 'Access thousands of practice problems with instant feedback and detailed solutions.',
      link: '/why-mathstack-ai#practice'
    },
    {
      icon: <Sparkles className="w-8 h-8 text-[#6C63FF]" />,
      title: 'Track Your Progress',
      description: 'Monitor your improvement with detailed analytics and personalized recommendations.',
      link: '/why-mathstack-ai#progress-tracking'
    }
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
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Master math with <span className="bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] bg-clip-text text-transparent">AI-powered learning</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Transform your math skills with personalized AI tutoring, interactive lessons, and unlimited practice problems designed to help you succeed.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <SignUpButton mode="modal">
                  <button 
                    className="btn-primary inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white"
                  >
                    Get started for free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </SignUpButton>
                <Link 
                  href="/why-mathstack-ai" 
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-[#6C63FF] hover:bg-gray-50 rounded-full transition-colors"
                >
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why choose MathStack AI?</h2>
              <p className="text-gray-600">Our platform combines cutting-edge AI technology with proven learning methodologies to help you master math at your own pace.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} link="/why-mathstack-ai" />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to transform your math learning?</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of students who are already mastering math with MathStack AI. Start your free trial today.
              </p>
              <SignUpButton mode="modal">
                <button 
                  className="btn-primary inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white"
                >
                  Start learning now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </SignUpButton>
            </div>
          </div>
        </section>
      </div>
      </SignedOut>
    </>
  );
}