import { getDashboardData } from "@/services/dashboard";
import { Header } from "@/components/layout/Header";
import { KpiCard } from "@/components/ui/KpiCard";
import { SectionCard } from "@/components/ui/SectionCard";
import { DataTable, type TableColumn } from "@/components/ui/DataTable";
import { ActivityList } from "@/components/ui/ActivityList";
import { formatCurrency, formatNumber, formatDateShort } from "@/lib/utils";
import type { ObligationItem } from "@/types";

// ─── Badge helper ─────────────────────────────────────────
function ObligationBadge({ status }: { status: ObligationItem["status"] }) {
  const styles =
    status === "PENDING"
      ? { background: "#FEF0F0", color: "#C0505A" }
      : { background: "#EEF7F2", color: "#2E6B52" };
  const label = status === "PENDING" ? "Pendiente" : "Pagado";
  return (
    <span
      className="text-[0.7rem] font-semibold px-2 py-0.5 rounded-full"
      style={styles}
    >
      {label}
    </span>
  );
}

const OBLIGATION_COLS: TableColumn<ObligationItem>[] = [
  {
    key: "concept",
    header: "Concepto",
    render: (row) => (
      <span className="font-medium text-neutral-900">{row.concept}</span>
    ),
  },
  {
    key: "dueDate",
    header: "Vence",
    render: (row) => (
      <span className="text-[0.75rem] text-neutral-400 font-mono">
        {formatDateShort(row.dueDate)}
      </span>
    ),
  },
  {
    key: "amount",
    header: "Monto",
    align: "right",
    render: (row) => (
      <span className="font-mono text-[0.78rem]">
        {formatCurrency(Number(row.amount), row.currency)}
      </span>
    ),
  },
  {
    key: "status",
    header: "Estado",
    align: "center",
    render: (row) => <ObligationBadge status={row.status} />,
  },
];

// ─── Error UI ─────────────────────────────────────────────
function DashboardError({ message }: { message: string }) {
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
          No se pudo cargar el dashboard
        </p>
        <p className="text-xs text-neutral-400">{message}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────
export default async function DashboardPage() {
  let data;
  try {
    data = await getDashboardData();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error de conexión con el servidor";
    return <DashboardError message={message} />;
  }

  const { stock, livestock, financial, obligations, lastMovements } = data;

  // Combine urgent + upcoming obligations for the table (urgent first)
  const allObligations = [...obligations.urgent, ...obligations.upcoming];

  // KPI derived values
  const monthlyResultPositive = financial.monthlyResult >= 0;
  const resultProgress = Math.min(
    100,
    financial.monthlyIncome > 0
      ? (financial.monthlyResult / financial.monthlyIncome) * 100
      : 0
  );

  return (
    <>
      <Header
        title="Dashboard"
        subtitle="Campaña 2024 · Establecimiento La Primavera"
      />

      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-7 flex flex-col gap-5 max-w-[1400px]">

          {/* ── KPI Row ─────────────────────────────────── */}
          <div
            className="grid gap-3.5"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
            role="region"
            aria-label="Indicadores principales"
          >
            <KpiCard
              label="Cabezas Hacienda"
              value={formatNumber(livestock.totalHeads)}
              trend={{ direction: "up", label: "rodeo actual" }}
              progress={{ value: 60, color: "#C8D84B" }}
            />
            <KpiCard
              label="Stock Neto"
              value={`${formatNumber(stock.totalNetStock)} u`}
              trend={
                stock.totalNetStock >= 0
                  ? { direction: "up", label: "stock disponible" }
                  : { direction: "down", label: "stock negativo" }
              }
              progress={{
                value: stock.totalNetStock > 0 ? 50 : 0,
                color: "#E07070",
              }}
            />
            <KpiCard
              label="Ingresos del Mes"
              value={formatCurrency(financial.monthlyIncome)}
              trend={{ direction: "up", label: "mes en curso" }}
              progress={{ value: 72 }}
            />
            <KpiCard
              label="Resultado del Mes"
              value={formatCurrency(financial.monthlyResult)}
              trend={{
                direction: monthlyResultPositive ? "up" : "down",
                label: monthlyResultPositive ? "positivo" : "negativo",
              }}
              progress={{
                value: Math.max(0, resultProgress),
                color: monthlyResultPositive ? "#4CAF7D" : "#E07070",
              }}
              accentBorder
              valueColor={monthlyResultPositive ? "#2E6B52" : "#C0505A"}
            />
          </div>

          {/* ── Middle Row: Obligaciones + Actividad ────── */}
          <div
            className="grid gap-3.5"
            style={{ gridTemplateColumns: "1fr 320px" }}
          >
            {/* Obligaciones */}
            <SectionCard
              title="Obligaciones Próximas"
              actions={
                allObligations.length > 0 ? (
                  <span className="text-[0.7rem] text-neutral-400">
                    {obligations.urgent.length} urgente
                    {obligations.urgent.length !== 1 ? "s" : ""}
                  </span>
                ) : undefined
              }
            >
              <DataTable<ObligationItem>
                columns={OBLIGATION_COLS}
                rows={allObligations}
                getRowKey={(row) => row.id}
                emptyMessage="Sin obligaciones próximas"
              />
            </SectionCard>

            {/* Actividad reciente */}
            <SectionCard title="Actividad Reciente">
              <ActivityList items={lastMovements} />
            </SectionCard>
          </div>

          {/* ── Bottom: Resumen financiero ───────────────── */}
          <div
            className="grid gap-3.5"
            style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
          >
            <SectionCard title="Ingresos del Mes">
              <div className="flex flex-col gap-1">
                <span className="text-[1.6rem] font-bold font-mono tracking-tight text-green-600">
                  {formatCurrency(financial.monthlyIncome)}
                </span>
                <span className="text-[0.72rem] text-neutral-400">
                  Total acreditado en el período
                </span>
                <div
                  className="rounded h-[5px] mt-2"
                  style={{ background: "#F0F2EE" }}
                >
                  <div
                    className="h-[5px] rounded"
                    style={{ width: "100%", background: "#4CAF7D" }}
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Egresos del Mes">
              <div className="flex flex-col gap-1">
                <span className="text-[1.6rem] font-bold font-mono tracking-tight" style={{ color: "#E07070" }}>
                  {formatCurrency(financial.monthlyExpense)}
                </span>
                <span className="text-[0.72rem] text-neutral-400">
                  Total debitado en el período
                </span>
                <div
                  className="rounded h-[5px] mt-2"
                  style={{ background: "#F0F2EE" }}
                >
                  <div
                    className="h-[5px] rounded"
                    style={{
                      width:
                        financial.monthlyIncome > 0
                          ? `${Math.min(100, (financial.monthlyExpense / financial.monthlyIncome) * 100)}%`
                          : "0%",
                      background: "#E07070",
                    }}
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Resultado Neto">
              <div className="flex flex-col gap-1">
                <span
                  className="text-[1.6rem] font-bold font-mono tracking-tight"
                  style={{
                    color: monthlyResultPositive ? "#2E6B52" : "#C0505A",
                  }}
                >
                  {formatCurrency(financial.monthlyResult)}
                </span>
                <span className="text-[0.72rem] text-neutral-400">
                  Ingresos menos egresos del mes
                </span>
                <div
                  className="rounded h-[5px] mt-2"
                  style={{ background: "#F0F2EE" }}
                >
                  <div
                    className="h-[5px] rounded"
                    style={{
                      width: `${Math.max(0, resultProgress)}%`,
                      background: monthlyResultPositive ? "#4CAF7D" : "#E07070",
                    }}
                  />
                </div>
              </div>
            </SectionCard>
          </div>

        </div>
      </div>
    </>
  );
}
