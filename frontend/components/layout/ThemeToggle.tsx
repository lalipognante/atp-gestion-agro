"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "atp-theme";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const next = saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
  }, []);

  function toggleTheme() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-btn border app-border app-surface px-3 py-2 text-[0.72rem] font-bold text-neutral-700 shadow-sm transition hover:app-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
      title={dark ? "Modo claro" : "Modo oscuro"}
    >
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
        {dark ? (
          <path d="M7.5 2v1.2m0 8.6V13M13 7.5h-1.2m-8.6 0H2m9.4-3.9-.85.85m-6.1 6.1-.85.85m7.8 0-.85-.85m-6.1-6.1-.85-.85M10 7.5A2.5 2.5 0 1 1 5 7.5a2.5 2.5 0 0 1 5 0Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        ) : (
          <path d="M11.7 9.3A4.8 4.8 0 0 1 5.7 3.3 4.8 4.8 0 1 0 11.7 9.3Z" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
      <span className="hidden sm:inline">{dark ? "Modo claro" : "Modo oscuro"}</span>
    </button>
  );
}
