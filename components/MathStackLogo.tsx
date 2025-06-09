import React from 'react';

/**
 * MathStack AI Logo Component
 * Based on the new diamond/rhombus stacked design with blue-purple gradient
 */
const MathStackLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Stacked Rhombus Logo */}
      <svg 
        width="40" 
        height="40" 
        viewBox="0 0 200 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-auto"
      >
        <defs>
          <linearGradient id="topGradient" x1="0" y1="0" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4CC9F0" /> {/* Light blue */}
            <stop offset="100%" stopColor="#8A63FD" /> {/* Purple */}
          </linearGradient>
          <linearGradient id="middleGradient" x1="0" y1="0" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#242740" /> {/* Dark blue/slate */}
            <stop offset="100%" stopColor="#242740" /> {/* Dark blue/slate */}
          </linearGradient>
          <linearGradient id="bottomGradient" x1="0" y1="0" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#242740" /> {/* Dark blue/slate */}
            <stop offset="100%" stopColor="#242740" /> {/* Dark blue/slate */}
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.2" />
          </filter>
        </defs>
        
        {/* Bottom rhombus */}
        <g filter="url(#shadow)">
          <path 
            d="M100 160L50 130L100 100L150 130L100 160Z" 
            fill="url(#bottomGradient)" 
          />
        </g>
        
        {/* Middle rhombus */}
        <g filter="url(#shadow)">
          <path 
            d="M100 130L50 100L100 70L150 100L100 130Z" 
            fill="url(#middleGradient)" 
            stroke="#8A63FD"
            strokeWidth="1"
          />
        </g>
        
        {/* Top rhombus with gradient */}
        <g filter="url(#shadow)">
          <path 
            d="M100 100L50 70L100 40L150 70L100 100Z" 
            fill="url(#topGradient)" 
          />
        </g>
      </svg>
      
      {/* Text Logo */}
      <div className="flex items-center">
        <span className="text-2xl font-bold bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] bg-clip-text text-transparent">
          MathStack
        </span>
        <span className="ml-1 text-2xl font-bold text-deep-sapphire">
          AI
        </span>
      </div>
    </div>
  );
};

export default MathStackLogo;
