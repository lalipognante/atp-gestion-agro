import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: "default" | "dark";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, variant = "default", className, ...props }, ref) => {
    const isDark = variant === "dark";
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            className={cn(
              "text-[11px] font-semibold uppercase tracking-widest",
              isDark ? "text-white/50" : "text-neutral-400"
            )}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all duration-150",
            "border focus:ring-1 focus:ring-green-500",
            isDark
              ? "bg-white/7 border-white/12 text-white placeholder:text-white/25 focus:border-green-500 focus:bg-white/10"
              : "app-surface-soft app-border text-neutral-900 placeholder:text-neutral-400 focus:border-green-500 focus:app-surface",
            error && "border-red-400 focus:ring-red-400",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
