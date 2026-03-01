"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/services/auth";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="15" height="15" fill="none" viewBox="0 0 15 15" aria-hidden="true">
        <rect x="1" y="1" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="8.5" y="1" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="1" y="8.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    href: "/campos",
    label: "Campos & Lotes",
    icon: (
      <svg width="15" height="15" fill="none" viewBox="0 0 15 15" aria-hidden="true">
        <path d="M1 13L5.5 4l3.5 5 2.5-3L14 13H1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/stock",
    label: "Stock",
    icon: (
      <svg width="15" height="15" fill="none" viewBox="0 0 15 15" aria-hidden="true">
        <rect x="1" y="4" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M5 4V3a2 2 0 014 0v1" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    href: "/hacienda",
    label: "Hacienda",
    icon: (
      <svg width="15" height="15" fill="none" viewBox="0 0 15 15" aria-hidden="true">
        <ellipse cx="7.5" cy="6" rx="4.5" ry="3" stroke="currentColor" strokeWidth="1.4" />
        <path d="M3 9c0 1.657 2.015 3 4.5 3s4.5-1.343 4.5-3" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    href: "/finanzas",
    label: "Finanzas",
    icon: (
      <svg width="15" height="15" fill="none" viewBox="0 0 15 15" aria-hidden="true">
        <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.4" />
        <path d="M7.5 4v4l2.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <aside
      className="flex flex-col w-[220px] shrink-0 min-h-screen"
      style={{ background: "#0B2218" }}
      aria-label="Navegación principal"
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-7">
        <div className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <path d="M11 2C6 2 2 6 2 11s4 9 9 9 9-4 9-9-4-9-9-9z" fill="#4CAF7D" fillOpacity="0.3" />
            <path d="M11 5c0 0-4 3-4 7 0 2.2 1.8 4 4 4s4-1.8 4-4c0-4-4-7-4-7z" fill="#4CAF7D" />
            <path d="M11 5v11" stroke="#0B2218" strokeWidth="1.5" />
          </svg>
          <span className="text-accent font-bold tracking-tight text-[1.1rem] leading-none">
            ATP Agro
          </span>
        </div>
        <div
          className="text-[0.65rem] font-medium tracking-[0.1em] uppercase mt-0.5 pl-[30px]"
          style={{ color: "#2E6B52" }}
        >
          Versión B1
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 flex-1 flex flex-col gap-0.5" role="navigation">
        <div
          className="text-[0.62rem] font-semibold tracking-[0.12em] uppercase px-2 pb-2"
          style={{ color: "#2E6B52" }}
        >
          Navegación
        </div>

        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-[9px] rounded-lg text-[0.83rem] font-medium transition-all duration-150 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              style={
                isActive
                  ? { background: "#1A4030", color: "#D6EDE4" }
                  : { color: "#5A7D6A" }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLElement).style.color = "#9EC4B0";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = "";
                  (e.currentTarget as HTMLElement).style.color = "#5A7D6A";
                }
              }}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: isActive ? "#4CAF7D" : "transparent" }}
                aria-hidden="true"
              />
              {item.icon}
              {item.label}
            </Link>
          );
        })}

        {/* Divider */}
        <div
          className="h-px my-3 mx-2"
          style={{ background: "#1A4030" }}
          role="separator"
        />

        <Link
          href="/configuracion"
          className="flex items-center gap-2.5 px-3 py-[9px] rounded-lg text-[0.83rem] font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          style={{ color: "#5A7D6A" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(255,255,255,0.05)";
            (e.currentTarget as HTMLElement).style.color = "#9EC4B0";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "";
            (e.currentTarget as HTMLElement).style.color = "#5A7D6A";
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full shrink-0" aria-hidden="true" />
          <svg width="15" height="15" fill="none" viewBox="0 0 15 15" aria-hidden="true">
            <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          Configuración
        </Link>
      </nav>

      {/* User */}
      <div
        className="px-5 py-4 mt-auto border-t"
        style={{ borderColor: "#1A4030" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-[0.75rem] shrink-0"
            style={{ background: "#235440", color: "#D6EDE4" }}
            aria-hidden="true"
          >
            JR
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[0.8rem] font-semibold truncate" style={{ color: "#D6EDE4" }}>
              Juan Rodríguez
            </div>
            <div className="text-[0.68rem]" style={{ color: "#3A8A68" }}>
              Administrador
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            style={{ color: "#2E6B52" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#7DC4A4")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#2E6B52")
            }
            aria-label="Cerrar sesión"
            title="Salir"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 14 14" aria-hidden="true">
              <path
                d="M5 2H2.5A1.5 1.5 0 001 3.5v7A1.5 1.5 0 002.5 12H5M9 10l3-3-3-3M12 7H5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
