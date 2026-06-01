import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}

const variants = {
  primary: "bg-accent text-green-950 hover:brightness-105 border-transparent shadow-sm",
  secondary: "app-surface text-neutral-700 app-border hover:app-surface-elevated shadow-sm",
  ghost: "bg-transparent text-neutral-600 border-transparent hover:app-surface-soft",
};

const sizes = {
  sm: "text-xs font-medium px-3 py-1.5 rounded-md",
  md: "text-sm font-semibold px-4 py-2 rounded-lg",
  lg: "text-sm font-semibold px-5 py-3 rounded-lg w-full",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
