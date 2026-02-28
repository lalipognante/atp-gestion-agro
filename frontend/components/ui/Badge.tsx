import { cn } from "@/lib/utils";
import type { Direction } from "@/types";

interface BadgeProps {
  direction: Direction;
}

const config: Record<Direction, { label: string; classes: string }> = {
  INCOME: {
    label: "Ingreso",
    classes: "bg-green-100 text-green-800",
  },
  EXPENSE: {
    label: "Egreso",
    classes: "bg-earth-100 text-earth-600",
  },
};

export function DirectionBadge({ direction }: BadgeProps) {
  const { label, classes } = config[direction];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded",
        classes
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
