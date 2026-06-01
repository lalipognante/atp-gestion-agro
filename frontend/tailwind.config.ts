import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
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
          950: "#10241A",
          900: "#143022",
          800: "#185B3C",
          700: "#1E7A4E",
          600: "#23935C",
          500: "#2BAA69",
          400: "#59BF86",
          300: "#8AD3A9",
          100: "#DCEFE3",
          50:  "#EFF7F1",
        },
        // ── Accent ───────────────────────────────────────────
        accent: {
          DEFAULT: "#B8D94A",
          yellow:  "#B8D94A",
        },
        // ── Neutral surface scale ────────────────────────────
        neutral: {
          50:  "var(--surface-soft)",
          100: "var(--app-bg)",
          200: "var(--line)",
          400: "var(--muted)",
          500: "var(--muted)",
          600: "var(--muted-strong)",
          700: "var(--text)",
          800: "var(--text)",
          900: "var(--text)",
        },
      },
      fontFamily: {
        sans:    ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono:    ["var(--font-dm-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        btn:  "10px",
      },
    },
  },
  plugins: [],
};

export default config;
