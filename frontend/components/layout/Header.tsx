import type { ReactNode } from "react";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b app-border app-surface px-4 pl-16 md:px-7 md:pl-7"
      role="banner"
    >
      <div>
        <p className="text-[0.65rem] font-medium text-neutral-400">Establecimiento activo</p>
        <div className="mt-0.5 flex items-center gap-1 text-[0.78rem] font-extrabold tracking-[-0.02em] text-neutral-900 sm:text-[0.82rem]">
          <span>La Primavera</span>
          <span className="mx-1 text-neutral-400">/</span>
          <span>Campaña 2025 / 26</span>
        </div>
        {subtitle && <span className="sr-only">{subtitle}</span>}
      </div>
      <div className="flex items-center gap-2" role="toolbar" aria-label={`Acciones de ${title}`}>
        <div className="hidden items-center gap-2 rounded-btn border app-border app-surface-soft px-3 py-2 text-[0.7rem] font-semibold text-neutral-400 lg:flex">
          <svg width="15" height="15" fill="none" viewBox="0 0 15 15" aria-hidden="true">
            <path d="M4 10.5h6a2.5 2.5 0 0 0 .35-4.98A3.5 3.5 0 0 0 3.55 6.7 2 2 0 0 0 4 10.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Clima no conectado
        </div>
        <ThemeToggle />
        <button type="button" className="relative rounded-btn border app-border app-surface-soft p-2 text-neutral-400" aria-label="Notificaciones">
          <svg width="15" height="15" fill="none" viewBox="0 0 15 15" aria-hidden="true">
            <path d="M3.5 10.5h8l-1-1.5V6a3 3 0 0 0-6 0v3l-1 1.5ZM6 12.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
        </button>
        {actions}
      </div>
    </header>
  );
}
