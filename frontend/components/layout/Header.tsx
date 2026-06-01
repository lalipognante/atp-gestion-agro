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
      className="sticky top-0 z-30 app-surface border-b app-border px-5 py-3.5 pl-16 md:px-7 md:pl-7 flex items-center justify-between gap-4"
      role="banner"
    >
      <div>
        <h1 className="text-[1.05rem] font-extrabold text-neutral-900 tracking-[-0.03em] leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="hidden sm:block text-[0.72rem] text-neutral-400 mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2.5" role="toolbar" aria-label="Acciones">
        <ThemeToggle />
        {actions}
      </div>
    </header>
  );
}
