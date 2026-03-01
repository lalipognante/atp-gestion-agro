interface KpiTrend {
  direction: "up" | "down";
  label: string;
}

interface KpiProgress {
  value: number; // 0–100
  color?: string;
}

interface KpiCardProps {
  label: string;
  value: string;
  trend?: KpiTrend;
  progress?: KpiProgress;
  accentBorder?: boolean;
  valueColor?: string;
}

export function KpiCard({
  label,
  value,
  trend,
  progress,
  accentBorder = false,
  valueColor,
}: KpiCardProps) {
  return (
    <div
      className={[
        "bg-white rounded-[14px] border border-gray-200 p-[18px_20px]",
        accentBorder ? "border-l-[3px] border-l-accent" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="region"
      aria-label={label}
    >
      {/* Label */}
      <div className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-neutral-400 mb-2.5">
        {label}
      </div>

      {/* Value */}
      <div
        className="text-[1.9rem] font-bold tracking-[-0.03em] font-mono leading-none"
        style={{ color: valueColor ?? "#1A201A" }}
      >
        {value}
      </div>

      {/* Trend */}
      {trend && (
        <div className="flex items-center gap-1.5 mt-2">
          <span
            className="text-[0.75rem] font-semibold"
            style={{ color: trend.direction === "up" ? "#4CAF7D" : "#E07070" }}
          >
            {trend.direction === "up" ? "↑" : "↓"} {trend.label}
          </span>
        </div>
      )}

      {/* Progress bar */}
      {progress && (
        <div
          className="rounded h-[5px] mt-3"
          style={{ background: "#F0F2EE" }}
          role="progressbar"
          aria-valuenow={progress.value}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-[5px] rounded transition-all"
            style={{
              width: `${Math.min(100, Math.max(0, progress.value))}%`,
              background: progress.color ?? "#4CAF7D",
            }}
          />
        </div>
      )}
    </div>
  );
}
