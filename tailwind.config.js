/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          600: '#9333EA',
          700: '#7E22CE',
        },
        'deep-sapphire': '#11173D',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
        math: ['var(--font-math)'],
      },
      letterSpacing: {
        tightest: '-.05em',
        tighter: '-.04em',
        tight: '-.025em',
        normal: '0',
        relaxed: '.01em',
        loose: '.025em',
      },
      lineHeight: {
        'extra-tight': '1.05',
        'heading': '1.1',
        'snug': '1.3',
        'normal': '1.5',
        'relaxed': '1.625',
        'loose': '2',
      },
      animation: {
        'gradient-x': 'gradient-x 8s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
    },
  },
  plugins: [],
}
