import React from 'react';

/**
 * MathStack AI Logo Component
 * Enhanced diamond/rhombus stacked design with premium gradients
 */
const MathStackLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Polished SVG Logo (external file, for best rendering) */}
      <img 
        src="/logo-polished.svg" 
        alt="MathStack AI Logo Icon" 
        className="h-10 w-10 min-w-[2.5rem] min-h-[2.5rem] drop-shadow-md" 
        draggable={false}
        style={{ display: 'inline-block', verticalAlign: 'middle' }}
      />
      
      {/* Text Logo - Enhanced typography */}
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
