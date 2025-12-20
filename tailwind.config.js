/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'raycast-bg': '#1E1E1E',
        'raycast-highlight': '#007AFF',
        'raycast-text': '#FFFFFF',
        'raycast-secondary': '#8E8E93',
        'raycast-border': '#38383A',
      },
      fontFamily: {
        'sf-pro': ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}