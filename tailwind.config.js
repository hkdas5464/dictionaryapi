const {heroui} = require('@heroui/theme');
module.exports = {
  darkMode: 'class', // Enable dark mode via a CSS class
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/(button|card|divider|input|listbox|table|ripple|spinner|form|checkbox|spacer).js"
  ],
  theme: {
    extend: {},
  },
  plugins: [heroui()],
}
