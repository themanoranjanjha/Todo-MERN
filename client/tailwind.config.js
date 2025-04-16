/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
       
        'sm': '540px',  // Default small screen
        'md': '768px',  // Default medium screen
       
      },
    },
  },
  plugins: [],
}

