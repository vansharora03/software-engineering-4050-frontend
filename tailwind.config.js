/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Covers all relevant files
  ],
  darkMode: "class", // Enables dark mode using the `dark` class
  theme: {
    extend: {
      colors: {
        background: "var(--background)", // Custom background color
        foreground: "var(--foreground)", // Custom foreground color
        primary: "#4a8b9e", // Example additional color
        secondary: "#36757d",
      },
      fontFamily: {
        sans: ["Helvetica Neue", "Arial", "sans-serif"], // Custom font
      },
      spacing: {
        18: "4.5rem", // Example custom spacing
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      animation: {
        fadeIn: "fadeIn 1s ease-in-out",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
  ],
};
