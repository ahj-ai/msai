'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { PricingSection } from "@/components/pricing-section"
import { SectionTitle } from "@/components/SectionTitle"

function FeatureCard({ icon, title, description, link }: { 
  icon: string; 
  title: string; 
  description: string;
  link: string;
}) {
  return (
    <div className="bg-[#1a1a2e] p-6 rounded-lg flex flex-col">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      <Link 
        href={link}
        className="mt-auto text-purple-400 hover:text-purple-300 text-sm"
      >
        Learn more →
      </Link>
    </div>
  );
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
    <div className="bg-[#1a1a2e] p-6 rounded-lg">
      <p className="text-gray-300 mb-4">"{quote}"</p>
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gray-600 rounded-full mr-3"></div>
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-gray-400 text-sm">{role}</div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-[#1a1a2e] text-white">
         {/* Hero Section */}
         <section className="container mx-auto px-4 pt-20 pb-12 text-center">
           <SectionTitle
             title="Elevate Your Math Skills with AI-Powered Tools"
             subtitle="Sharpen mental math, tackle custom problem sets, and track your progress—all in one platform."
           />
           <Link href="/signup">
             <Button 
               size="lg" 
               className="bg-purple-600 hover:bg-purple-700 text-xl py-6 px-8"
             >
               Try MathStack AI Free
             </Button>
           </Link>
         </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 pt-8 pb-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon="📈"
            title="Track Your Learning Progress"
            description="Monitor your improvement over time with personalized insights."
            link="/why-mathstack-ai#progress"
          />
          <FeatureCard
            icon="🎮"
            title="Adaptive Math Games"
            description="Challenge yourself with adaptive learning experiences."
            link="/products/brainiac"
          />
          <FeatureCard
            icon="🧪"
            title="Custom Problem Sets"
            description="Create and solve problems tailored to your learning goals."
            link="/products/problem-lab"
          />
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-purple-950">
          <PricingSection />
        </section>

        {/* Testimonials Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">See What Others Are Saying</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="MathStackAI has transformed my approach to math. The adaptive games make learning fun and challenging!"
              name="Alex Johnson"
              role="High School Student"
            />
            <TestimonialCard
              quote="As an educator, I find the custom problem sets invaluable for creating tailored assignments for my students."
              name="Sarah Lee"
              role="Math Teacher"
            />
            <TestimonialCard
              quote="The AI-powered features have helped me brush up on math concepts I use in my work. Highly recommended!"
              name="Mike Chen"
              role="Software Engineer"
            />
          </div>
          <div className="text-center mt-12">
            <Link href="/signup">
              <Button 
                size="lg"
                className="bg-purple-600 hover:bg-purple-700"
              >
                Join Them Today
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}