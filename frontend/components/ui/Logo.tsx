import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { mark: "w-8 h-8 rounded-lg", svg: "w-4 h-4", name: "text-base", sub: "text-[9px]" },
  md: { mark: "w-9 h-9 rounded-[9px]", svg: "w-5 h-5", name: "text-[17px]", sub: "text-[10px]" },
  lg: { mark: "w-14 h-14 rounded-2xl", svg: "w-8 h-8", name: "text-2xl", sub: "text-xs" },
};

export function Logo({ variant = "dark", size = "md" }: LogoProps) {
  const s = sizes[size];
  const isLight = variant === "light";

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={cn(
          s.mark,
          "flex items-center justify-center flex-shrink-0",
          isLight
            ? "bg-white/15 border border-white/25"
            : "bg-green-700"
        )}
      >
        <svg
          className={s.svg}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 19L9 5L14 19"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M6 14H12" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <path d="M14 5H20" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <path d="M17 5V19" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <div
          className={cn(
            s.name,
            "font-display leading-none font-normal",
            isLight ? "text-white" : "text-gray-900"
          )}
        >
          ATP
        </div>
        <div
          className={cn(
            s.sub,
            "uppercase tracking-widest font-medium",
            isLight ? "text-green-200" : "text-gray-500"
          )}
        >
          Gestión Agro
        </div>
      </div>
    </div>
  );
}
