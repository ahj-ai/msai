import React from 'react';

const MathStackLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-auto"
      >
        <defs>
          <linearGradient
            id="icon-gradient-1"
            x1="0"
            y1="24"
            x2="48"
            y2="24"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4F46E5" />
            <stop offset="1" stopColor="#7C3AED" />
          </linearGradient>
          <linearGradient
            id="icon-gradient-2"
            x1="0"
            y1="24"
            x2="48"
            y2="24"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#6366F1" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient
            id="icon-gradient-3"
            x1="0"
            y1="24"
            x2="48"
            y2="24"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#818CF8" />
            <stop offset="1" stopColor="#A78BFA" />
          </linearGradient>
        </defs>
        <path
          d="M40.5 22.4913L24 14L7.5 22.4913L24 30.9825L40.5 22.4913Z"
          fill="url(#icon-gradient-1)"
        />
        <path
          opacity="0.8"
          d="M40.5 30.7313L24 39.2225L7.5 30.7313L24 22.24L40.5 30.7313Z"
          fill="url(#icon-gradient-2)"
        />
        <path
          opacity="0.6"
          d="M7.5 22.4913L24 30.9825V39.2225L7.5 30.7313V22.4913Z"
          fill="url(#icon-gradient-3)"
        />
        <path
          d="M17.65 19.5C17.65 18.0614 18.9168 17 20.5 17H27.5C29.0832 17 30.35 18.0614 30.35 19.5C30.35 20.9386 29.0832 22 27.5 22H20.5C18.9168 22 17.65 20.9386 17.65 19.5Z"
          fill="white"
          fillOpacity="0.1"
        />
        <path
          d="M24 17C28.2167 17 31.4772 17.7618 33.5 18.5C31.4772 19.2382 28.2167 20 24 20C19.7833 20 16.5228 19.2382 14.5 18.5C16.5228 17.7618 19.7833 17 24 17Z"
          fill="white"
          fillOpacity="0.2"
        />
      </svg>
      {/* Text */}
      <span className="text-2xl font-bold text-gray-800">
        MathStack
        <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">AI</span>
      </span>
    </div>
  );
};

export default MathStackLogo;

