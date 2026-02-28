import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  icon?: ReactNode;
}

export function StatCard({ label, value, sub, accent, icon }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-[10px] border p-5 shadow-sm transition-shadow hover:shadow-md",
        accent
          ? "bg-green-800 border-green-700"
          : "bg-white border-gray-200"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <span
          className={cn(
            "text-[11px] font-semibold uppercase tracking-widest",
            accent ? "text-green-200" : "text-gray-500"
          )}
        >
          {label}
        </span>
        {icon && (
          <span className={cn(accent ? "text-green-400" : "text-gray-400")}>
            {icon}
          </span>
        )}
      </div>
      <div
        className={cn(
          "font-display text-3xl leading-none",
          accent ? "text-white" : "text-gray-900"
        )}
      >
        {value}
      </div>
      {sub && (
        <div
          className={cn(
            "text-xs mt-2",
            accent ? "text-green-200" : "text-gray-500"
          )}
        >
          {sub}
        </div>
      )}
    </div>
  );
}
