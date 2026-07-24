/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3525cd',
        'primary-container': '#4f46e5',
        secondary: '#5846ca',
        coral: '#FF6B5C',
        surface: '#fcf8ff',
        background: '#fcf8ff',
        'on-background': '#1a1a2e',
      },
    },
  },
  plugins: [],
};
