import { getCurrentUser } from "@/services/user";
import { Header } from "@/components/layout/Header";
import { SectionCard } from "@/components/ui/SectionCard";

// ─── Role badge ────────────────────────────────────────────
function RoleBadge({ role }: { role: "ADMIN" | "VIEWER" }) {
  const isAdmin = role === "ADMIN";
  return (
    <span
      className="text-[0.75rem] font-semibold px-3 py-1 rounded-full"
      style={
        isAdmin
          ? { background: "#EEF7F2", color: "#2E6B52" }
          : { background: "#F0F4FF", color: "#3A5AA0" }
      }
    >
      {isAdmin ? "Administrador" : "Visualizador"}
    </span>
  );
}

// ─── Row helper ───────────────────────────────────────────
function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <span className="text-[0.8rem] font-semibold text-neutral-500 uppercase tracking-[0.06em]">
        {label}
      </span>
      <div className="text-[0.88rem]">{children}</div>
    </div>
  );
}

// ─── Error UI ─────────────────────────────────────────────
function PageError({ message }: { message: string }) {
  return (
    <div className="flex-1 flex items-center justify-center p-10">
      <div className="text-center max-w-sm">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: "#FEF0F0" }}
          aria-hidden="true"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
            <path
              d="M9 6v4M9 13h.01M3 15h12l-6-12-6 12z"
              stroke="#C0505A"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-sm font-semibold text-neutral-900 mb-1">
          No se pudo cargar la configuración
        </p>
        <p className="text-xs text-neutral-400">{message}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────
export default async function ConfiguracionPage() {
  let user;
  try {
    user = await getCurrentUser();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error de conexión con el servidor";
    return <PageError message={message} />;
  }

  return (
    <>
      <Header
        title="Configuración"
        subtitle="Información de cuenta y sistema"
      />

      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-7 flex flex-col gap-5 max-w-[800px]">

          {/* ── Profile card ─────────────────────────────── */}
          <SectionCard title="Perfil de Usuario">
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-5 pb-4 border-b border-gray-100">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-[1.1rem] shrink-0"
                style={{ background: "#1A4030", color: "#D6EDE4" }}
                aria-hidden="true"
              >
                {user.role === "ADMIN" ? "A" : "V"}
              </div>
              <div>
                <div className="text-[1rem] font-bold text-neutral-900">
                  {user.role === "ADMIN" ? "Administrador" : "Visualizador"}
                </div>
                <div className="text-[0.78rem] text-neutral-400 font-mono mt-0.5">
                  ID: {user.userId}
                </div>
              </div>
            </div>

            <InfoRow label="ID de Usuario">
              <span className="font-mono text-[0.82rem] text-neutral-700">
                {user.userId}
              </span>
            </InfoRow>
            <InfoRow label="Rol">
              <RoleBadge role={user.role} />
            </InfoRow>
            <InfoRow label="Sistema">
              <span className="text-neutral-700">ATP Gestión Agro · B1</span>
            </InfoRow>
          </SectionCard>

          {/* ── Permissions card ─────────────────────────── */}
          <SectionCard title="Permisos">
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Ver Dashboard", allowed: true },
                { label: "Ver Hacienda", allowed: true },
                { label: "Ver Stock", allowed: true },
                { label: "Ver Finanzas", allowed: user.role === "ADMIN" },
                { label: "Ver Campos & Lotes", allowed: true },
                { label: "Crear movimientos", allowed: user.role === "ADMIN" },
                { label: "Gestionar obligaciones", allowed: user.role === "ADMIN" },
              ].map(({ label, allowed }) => (
                <div key={label} className="flex items-center justify-between py-2">
                  <span className="text-[0.85rem] text-neutral-700">{label}</span>
                  <span
                    className="text-[0.72rem] font-semibold px-2 py-0.5 rounded-full"
                    style={
                      allowed
                        ? { background: "#EEF7F2", color: "#2E6B52" }
                        : { background: "#F5F5F5", color: "#9A9A9A" }
                    }
                  >
                    {allowed ? "Permitido" : "Restringido"}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>

        </div>
      </div>
    </>
  );
}
