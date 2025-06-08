// components/BrandLogo.tsx
import React from 'react';

const BrandLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 800 600"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* MathStack Text */}
      <text
        x="230"
        y="370"
        fontFamily="Arial, sans-serif"
        fontSize="120"
        fontWeight="bold"
        fill="#2D2654"
      >
        MathStack
      </text>
      
      {/* AI Box */}
      <rect x="665" y="325" width="110" height="110" rx="15" fill="#2D2654" />
      <text
        x="685"
        y="405"
        fontFamily="Arial, sans-serif"
        fontSize="70"
        fontWeight="bold"
        fill="#A5A6F6"
      >
        AI
      </text>
      
      {/* Infinity Stack Logo */}
      <g transform="translate(340, 450) scale(0.9)">
        {/* Bottom Layer */}
        <rect x="0" y="90" width="200" height="50" rx="10" fill="#8B5CF6" />
        
        {/* Middle Layer */}
        <rect x="20" y="55" width="160" height="50" rx="10" fill="#818CF8" />
        
        {/* Top Layer */}
        <rect x="40" y="20" width="120" height="50" rx="10" fill="#2D2654" />
        
        {/* Infinity Symbol */}
        <path
          d="M100 45 C80 25, 60 25, 50 45 C60 65, 80 65, 100 45 C120 25, 140 25, 150 45 C140 65, 120 65, 100 45"
          stroke="white"
          strokeWidth="6"
          fill="none"
        />
      </g>
    </svg>
  );
};

export default BrandLogo;
