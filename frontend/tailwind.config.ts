import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          950: "#0a1a10",
          900: "#0f2318",
          800: "#1a3a28",
          700: "#1e4d35",
          600: "#2d6a4a",
          500: "#3d8a5f",
          400: "#5aaa7a",
          200: "#c4ddd0",
          100: "#e8f3ed",
        },
        earth: {
          600: "#8b6f47",
          400: "#b8956a",
          100: "#f5ede3",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-dm-serif)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
