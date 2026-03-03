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
        // ── Agro green scale (from HTML mockup) ──────────────
        green: {
          950: "#0B2218",
          900: "#122F21",
          800: "#1A4030",
          700: "#235440",
          600: "#2E6B52",
          500: "#3A8A68",
          400: "#52A882",
          300: "#7DC4A4",
          100: "#D6EDE4",
          50:  "#EEF7F2",
        },
        // ── Accent ───────────────────────────────────────────
        accent: {
          DEFAULT: "#4CAF7D",
          yellow:  "#C8D84B",
        },
        // ── Neutral surface scale ────────────────────────────
        neutral: {
          50:  "#F8F9F7",
          100: "#F0F2EE",
          200: "#E1E5DF",
          400: "#9AA49A",
          600: "#5A6659",
          800: "#2D3530",
          900: "#1A201A",
        },
      },
      fontFamily: {
        sans:    ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono:    ["var(--font-dm-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-dm-serif)", "Georgia", "serif"],
      },
      borderRadius: {
        card: "14px",
        btn:  "8px",
      },
    },
  },
  plugins: [],
};

export default config;
