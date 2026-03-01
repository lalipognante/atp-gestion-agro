import type { LastMovement } from "@/types";
import { formatCurrency, formatDateShort } from "@/lib/utils";

interface ActivityListProps {
  items: LastMovement[];
}

const SOURCE_STYLES: Record<
  LastMovement["source"],
  { bg: string; iconColor: string }
> = {
  financial: { bg: "#EEF7F2", iconColor: "#3A8A68" },
  livestock:  { bg: "#FEF5F0", iconColor: "#C0705A" },
  stock:      { bg: "#FAFBE8", iconColor: "#7A8A10" },
};

const SOURCE_LABEL: Record<LastMovement["source"], string> = {
  financial: "Finanzas",
  livestock: "Hacienda",
  stock:     "Stock",
};

function ActivityIcon({ source }: { source: LastMovement["source"] }) {
  if (source === "financial") {
    return (
      <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
        <circle cx="7" cy="7" r="5" stroke="#3A8A68" strokeWidth="1.4" />
        <path d="M7 4v4l2 1" stroke="#3A8A68" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (source === "livestock") {
    return (
      <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
        <ellipse cx="7" cy="5.5" rx="4" ry="2.5" stroke="#C0705A" strokeWidth="1.4" />
        <path d="M3 8c0 1.38 1.79 2.5 4 2.5s4-1.12 4-2.5" stroke="#C0705A" strokeWidth="1.4" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
      <rect x="2" y="3" width="10" height="8" rx="1.5" stroke="#7A8A10" strokeWidth="1.4" />
      <path d="M5 3V2.5a2 2 0 014 0V3" stroke="#7A8A10" strokeWidth="1.4" />
    </svg>
  );
}

function formatMovementDetail(item: LastMovement): string {
  if (item.source === "financial" && item.amount != null && item.currency) {
    return formatCurrency(item.amount, item.currency as "ARS" | "USD");
  }
  if (item.quantity != null) {
    return `${item.quantity.toLocaleString("es-AR")}${item.unit ? " " + item.unit : ""}`;
  }
  return "";
}

export function ActivityList({ items }: ActivityListProps) {
  if (items.length === 0) {
    return (
      <p className="text-[0.8rem] text-neutral-400 py-4 text-center">
        Sin actividad reciente
      </p>
    );
  }

  return (
    <ul className="flex flex-col" role="list">
      {items.map((item, i) => {
        const style = SOURCE_STYLES[item.source];
        const detail = formatMovementDetail(item);
        const isLast = i === items.length - 1;

        return (
          <li
            key={item.id}
            className={[
              "flex gap-2.5 py-2.5",
              !isLast ? "border-b border-gray-50" : "",
            ].join(" ")}
          >
            {/* Icon */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: style.bg }}
              aria-hidden="true"
            >
              <ActivityIcon source={item.source} />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="text-[0.8rem] font-semibold text-neutral-900 truncate">
                {item.description}
              </div>
              <div className="text-[0.7rem] text-neutral-400 flex items-center gap-1.5 mt-0.5">
                <span>{SOURCE_LABEL[item.source]}</span>
                {detail && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{detail}</span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <time dateTime={item.date}>{formatDateShort(item.date)}</time>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
