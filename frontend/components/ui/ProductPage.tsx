import type { ReactNode } from "react";

export function PageIntro({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b app-border pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        <div className="mb-2 text-[0.66rem] font-extrabold uppercase tracking-[0.16em] text-green-700">
          {eyebrow}
        </div>
        <h2 className="text-[1.55rem] font-extrabold tracking-[-0.065em] text-neutral-900 sm:text-[1.85rem]">
          {title}
        </h2>
        <p className="mt-1.5 text-[0.82rem] leading-5 text-neutral-400">{description}</p>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function SummaryMetric({
  label,
  value,
  detail,
  tone = "default",
}: {
  label: string;
  value: string;
  detail?: string;
  tone?: "default" | "positive" | "warning" | "danger";
}) {
  const toneClass = {
    default: "text-neutral-900",
    positive: "text-green-700",
    warning: "text-[#8A6A13]",
    danger: "text-[#C0505A]",
  }[tone];

  return (
    <div className="app-surface app-shadow rounded-card border app-border px-4 py-4">
      <div className="text-[0.64rem] font-extrabold uppercase tracking-[0.12em] text-neutral-400">
        {label}
      </div>
      <div className={`mt-2 text-[1.55rem] font-extrabold tracking-[-0.07em] tabular-nums ${toneClass}`}>
        {value}
      </div>
      {detail && <div className="mt-1 text-[0.7rem] font-medium text-neutral-400">{detail}</div>}
    </div>
  );
}

export function CompactEmpty({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[12px] border border-dashed app-border app-surface-soft px-4 py-5 text-center text-[0.78rem] text-neutral-400">
      {children}
    </div>
  );
}
