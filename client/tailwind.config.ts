import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',
        'primary-foreground': '#ffffff',
        destructive: '#DC2626',
        'destructive-foreground': '#ffffff',
        accent: '#FBBC05',
        background: '#ffffff',
        ring: '#2563EB',
        'accent-foreground': '#1F2937',
        secondary: '#F3F4F6',
        'secondary-foreground': '#1F2937',
        input: '#D1D5DB',
      },
    },
  },
  plugins: [],
};

export default config;
