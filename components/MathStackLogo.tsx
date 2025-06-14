import React from 'react';

/**
 * MathStack AI Logo Component
 * Enhanced diamond/rhombus stacked design with premium gradients
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
          {/* Top gradient - vibrant blue to purple */}
          <linearGradient id="topGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4CC9F0" /> {/* Light blue */}
            <stop offset="50%" stopColor="#7B64FF" /> {/* Blue-purple */}
            <stop offset="100%" stopColor="#8A63FD" /> {/* Purple */}
          </linearGradient>
          
          {/* Middle gradient - deep blue with subtle variation */}
          <linearGradient id="middleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#36385A" /> {/* Medium blue/slate */}
            <stop offset="100%" stopColor="#242740" /> {/* Dark blue/slate */}
          </linearGradient>
          
          {/* Bottom gradient - darker blue with subtle variation */}
          <linearGradient id="bottomGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#242740" /> {/* Dark blue/slate */}
            <stop offset="100%" stopColor="#1A1B2E" /> {/* Darker blue/slate */}
          </linearGradient>
          
          {/* Edge highlight for the middle and bottom rhombus */}
          <linearGradient id="edgeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8A63FD" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#4CC9F0" stopOpacity="0.4" />
          </linearGradient>
          
          {/* Enhanced drop shadow */}
          <filter id="enhancedShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.15" floodColor="#000" />
            <feDropShadow dx="0" dy="2" stdDeviation="1" floodOpacity="0.25" floodColor="#8A63FD" />
          </filter>
          
          {/* Subtle inner glow */}
          <filter id="innerGlow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feOffset dx="0" dy="0" result="offsetBlur" />
            <feComposite in="SourceGraphic" in2="offsetBlur" operator="over" />
          </filter>
        </defs>
        
        {/* Bottom rhombus */}
        <g filter="url(#enhancedShadow)">
          <path 
            d="M100 160L50 130L100 100L150 130L100 160Z" 
            fill="url(#bottomGradient)" 
          />
          <path 
            d="M100 160L50 130L100 100L150 130L100 160Z" 
            fill="none"
            stroke="url(#edgeGlow)" 
            strokeWidth="0.75"
            opacity="0.6"
          />
        </g>
        
        {/* Middle rhombus */}
        <g filter="url(#enhancedShadow)">
          <path 
            d="M100 130L50 100L100 70L150 100L100 130Z" 
            fill="url(#middleGradient)" 
            filter="url(#innerGlow)"
          />
          <path 
            d="M100 130L50 100L100 70L150 100L100 130Z" 
            fill="none"
            stroke="url(#edgeGlow)" 
            strokeWidth="0.75"
          />
        </g>
        
        {/* Top rhombus with gradient */}
        <g filter="url(#enhancedShadow)">
          <path 
            d="M100 100L50 70L100 40L150 70L100 100Z" 
            fill="url(#topGradient)" 
            filter="url(#innerGlow)"
          />
        </g>
      </svg>
      
      {/* Text Logo - Enhanced typography */}
      <div className="flex items-center">
        <span className="text-2xl font-bold bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] bg-clip-text text-transparent">
          MathStack
        </span>
        <span className="ml-1 text-2xl font-bold text-[#242740]">
          AI
        </span>
      </div>
    </div>
  );
};

export default MathStackLogo;
