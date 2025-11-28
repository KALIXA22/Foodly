/** @type {import('tailwindcss').Config} */
export default {
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#22C55E",         // fresh green (green-500)
        "primary-hover": "#16A34A", // green-600
        secondary: "#F97316",       // soft orange (orange-500)
        "secondary-hover": "#EA580C", 
        "bg-main": "#F9FAFB",       // gray-50
        section: "#ECFDF3",         // light green tint
        "text-main": "#111827",     // gray-900
        "text-muted": "#6B7280",    // gray-500
        success: "#16A34A",
        warning: "#FACC15",
        error: "#DC2626"
      }
    },
  },
  plugins: [],
}

