/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#007aff',
        secondary: '#f2f2f7',
        textPrimary: '#000000',
        textSecondary: '#6c6c70',
        background: '#ffffff',
        surface: '#f2f2f7',
        border: '#e5e5e5',
      },
    },
  },
  plugins: [],
};