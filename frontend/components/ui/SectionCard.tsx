import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  actions,
  children,
  className = "",
}: SectionCardProps) {
  return (
    <section
      className={`bg-white rounded-[14px] border border-gray-200 p-5 ${className}`}
      aria-labelledby={`section-${title.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <div className="flex items-center justify-between mb-3.5">
        <h2
          id={`section-${title.replace(/\s+/g, "-").toLowerCase()}`}
          className="text-[0.88rem] font-bold text-neutral-900"
        >
          {title}
        </h2>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </section>
  );
}
