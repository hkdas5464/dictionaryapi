const {heroui} = require('@heroui/theme');
module.exports = {
  darkMode: 'class', // Enable dark mode via a CSS class
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/(button|card|divider|input|listbox|pagination|table|ripple|spinner|form|checkbox|spacer).js"
  ],
  theme: {
    extend: { animation: {
      spotlight: "spotlight 2s ease .75s 1 forwards",
    },
    keyframes: {
      spotlight: {
        "0%": {
          opacity: 0,
          transform: "translate(-72%, -62%) scale(0.5)",
        },
        "100%": {
          opacity: 1,
          transform: "translate(-50%,-40%) scale(1)",
        },
      },
    },},
  },
  plugins: [heroui()],
}
