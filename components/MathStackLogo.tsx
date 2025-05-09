import React from 'react';

const MathStackLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="modernGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#818CF8', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#A78BFA', stopOpacity: 1 }} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <g transform="translate(20, 20)">
        {/* Geometric bars with glow */}
        <g filter="url(#glow)">
          <rect x="0" y="0" width="30" height="4" fill="url(#modernGradient)" />
          <rect x="0" y="8" width="20" height="4" fill="url(#modernGradient)" opacity="0.8" />
          <rect x="0" y="16" width="10" height="4" fill="url(#modernGradient)" opacity="0.6" />
        </g>

        {/* Updated text colors */}
        <text x="45" y="20" fontFamily="Inter, system-ui" fontSize="24" fontWeight="700" fill="#E5E7EB">
          MathStack
          <tspan fill="#818CF8">AI</tspan>
        </text>
      </g>
    </svg>
  );
};

export default MathStackLogo;

