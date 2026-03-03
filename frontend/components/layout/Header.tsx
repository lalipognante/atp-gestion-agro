import type { ReactNode } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-10 bg-white border-b border-gray-200 px-7 py-[14px] flex items-center justify-between"
      role="banner"
    >
      <div>
        <h1 className="text-[1.05rem] font-bold text-neutral-900 tracking-tight leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[0.75rem] text-neutral-400 mt-0.5">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2.5" role="toolbar" aria-label="Acciones">
          {actions}
        </div>
      )}
    </header>
  );
}
