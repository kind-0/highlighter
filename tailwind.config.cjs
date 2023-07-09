/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { 50: '#FFF5F2', 100: '#FFF1EE', 200: '#FFE4DE', 300: '#FFD5CC', 400: '#FFBCAD', 500: '#FE795D', 600: '#EF562F', 700: '#EB4F27', 800: '#CC4522', 900: '#A5371B'},
        'gray-950': '#0b0f18',
        'gray-1000': '#0a0a0a',
        'gray-1100': '#080808',
        'beige-150': '#F5F1EF',
        'beige-200': '#F7F6F4',
        'beige-300': '#F0EDEA',
        'primary-500': '#FF6109',
        'primary-600': '#E65A08',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require("@tailwindcss/typography"),
  ],
}
