/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // Ensure that this includes your HTML files
    "./src/**/*.{js,ts,jsx,tsx}", // Tailwind should scan your JS, TS, JSX, and TSX files
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'pulse': {
          '0%': {
            transform: 'scale(1)',
            opacity: '1',
          },
          '50%': {
            transform: 'scale(1.05)',
            opacity: '0.8',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
      },
      animation: {
        'fade-in': 'fade-in 1s ease-out forwards',
        'slide-up': 'slide-up 0.6s ease-out forwards',
        'gradient-x': 'gradient-x 6s ease infinite',
        'pulse': 'pulse 1.5s ease-in-out infinite', // Add a custom pulse animation
      },
      colors: {
        // Custom colors for the theme
        'legal-purple': '#6a0dad', // Example custom color for your theme
        'legal-pink': '#ff1493', // Another custom color for accent
        'legal-background': '#f4f4f9', // Light background color for the profile page
        'legal-border': '#d3d3d3', // Light border color for inputs and buttons
        'legal-gray': '#6b6b6b', // Gray color for text in dark mode
        'legal-dark': '#333', // Dark color for headers and buttons
      },
      fontFamily: {
        // Custom fonts for a legal-style theme
        legal: ['"Roboto Slab"', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
      },
      screens: {
        'xs': '480px', // Add custom breakpoint for small devices
      },
    },
  },
  plugins: [
    // You can include any additional plugins if needed for your project
  ],
};
