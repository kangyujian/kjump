/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 深色主题配色方案
        'raycast-bg': '#1C1C1E',
        'raycast-bg-secondary': '#2C2C2E',
        'raycast-bg-tertiary': '#3A3A3C',
        'raycast-highlight': '#0A84FF',
        'raycast-highlight-hover': '#0071E3',
        'raycast-text': '#FFFFFF',
        'raycast-text-secondary': '#8E8E93',
        'raycast-text-tertiary': '#636366',
        'raycast-border': '#48484A',
        'raycast-border-focus': '#0A84FF',
        'raycast-success': '#30D158',
        'raycast-warning': '#FFD60A',
        'raycast-error': '#FF453A',
        'raycast-overlay': 'rgba(0, 0, 0, 0.5)',
      },
      fontFamily: {
        'sf-pro': ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'raycast': '12px',
        'raycast-sm': '8px',
        'raycast-lg': '16px',
      },
      boxShadow: {
        'raycast': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'raycast-lg': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'raycast-inset': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backdropBlur: {
        'raycast': '20px',
      },
    },
  },
  plugins: [],
}