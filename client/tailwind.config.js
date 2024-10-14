/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        darkBackground: '#1a202c', 
        darkCard: '#2d3748', 
        darkText: '#a0aec0',
        darkBorder: '#4a5568', 
      },
      backgroundColor: {
        'dark-bg': '#1a202c', 
        'dark-card': '#2d3748', 
      },
      textColor: {
        'dark-text': '#a0aec0', 
      },
      borderColor: {
        'dark-border': '#4a5568', 
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['dark'],
      textColor: ['dark'],
      borderColor: ['dark'],
    },
  },
  plugins: [],
};
