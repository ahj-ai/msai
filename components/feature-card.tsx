import Link from 'next/link';
import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  link: string;
}

export function FeatureCard({ icon, title, description, link }: FeatureCardProps) {
  return (
    <Link href={link} className="card block h-full hover:no-underline">
      <div className="flex flex-col h-full">
        <div className="w-12 h-12 flex items-center justify-center bg-indigo-50 rounded-xl mb-4">
          {icon}
        </div>
        <h3 className="font-display text-xl font-bold tracking-tight mb-3 text-gray-900">{title}</h3>
        <p className="font-body text-gray-600 mt-2 flex-grow leading-relaxed">{description}</p>
        <div className="mt-4 text-indigo-600 font-medium flex items-center font-display tracking-tight text-hover-animate">
          Learn more
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
