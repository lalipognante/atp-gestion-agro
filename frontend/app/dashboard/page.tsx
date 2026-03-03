export const dynamic = "force-dynamic";

import { getDashboardData } from "@/services/dashboard";
import { Header } from "@/components/layout/Header";
import { KpiCard } from "@/components/ui/KpiCard";
import { SectionCard } from "@/components/ui/SectionCard";
import { DataTable, type TableColumn } from "@/components/ui/DataTable";
import { ActivityList } from "@/components/ui/ActivityList";
import { formatCurrency, formatNumber, formatDateShort, formatDate } from "@/lib/utils";
import type { ObligationItem, HealthRecord } from "@/types";

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

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  CASH: "Efectivo",
  TRANSFER: "Transferencia",
  THIRD_PARTY_CHECK: "Cheque Tercero",
  QUINTALES: "Quintales",
  OTHER: "Otro",
};

const TREATMENT_LABEL: Record<string, string> = {
  VACUNA: "Vacunación",
  BAÑO: "Baño",
  DESPARASITACION: "Desparasitación",
  OTRO: "Otro",
};

const LIVESTOCK_CATEGORY_LABEL: Record<string, string> = {
  TERNEROS: "Terneros",
  NOVILLOS: "Novillos",
  VACAS: "Vacas",
  TOROS: "Toros",
};

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

const HEALTH_COLS: TableColumn<HealthRecord>[] = [
  {
    key: "date",
    header: "Fecha",
    render: (row) => (
      <span className="text-[0.75rem] text-neutral-400 font-mono">
        {formatDate(row.date)}
      </span>
    ),
  },
  {
    key: "treatmentType",
    header: "Tratamiento",
    render: (row) => (
      <span className="text-[0.82rem] text-neutral-700">
        {TREATMENT_LABEL[row.treatmentType] ?? row.treatmentType}
      </span>
    ),
  },
  {
    key: "quantity",
    header: "Cant.",
    align: "right",
    render: (row) => (
      <span className="font-mono text-[0.82rem]">{formatNumber(row.quantity)}</span>
    ),
  },
  {
    key: "cost",
    header: "Costo",
    align: "right",
    render: (row) => (
      <span className="font-mono text-[0.78rem] text-neutral-500">
        {row.cost ? formatCurrency(Number(row.cost)) : "—"}
      </span>
    ),
  },
];

// ─── Payment method row ────────────────────────────────────
interface PaymentRow {
  method: string;
  total: number;
}

const PAYMENT_COLS: TableColumn<PaymentRow>[] = [
  {
    key: "method",
    header: "Método",
    render: (row) => (
      <span className="text-[0.82rem] font-medium text-neutral-800">
        {PAYMENT_METHOD_LABEL[row.method] ?? row.method}
      </span>
    ),
  },
  {
    key: "total",
    header: "Total",
    align: "right",
    render: (row) => (
      <span className="font-mono text-[0.82rem] font-semibold text-neutral-900">
        {formatCurrency(row.total)}
      </span>
    ),
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

  const { stock, livestock, financial, obligations, lastMovements, paymentByMethod, latestHealthRecords } = data;

  const allObligations = [...obligations.urgent, ...obligations.upcoming];
  const monthlyResultPositive = financial.monthlyResult >= 0;
  const resultProgress = Math.min(
    100,
    financial.monthlyIncome > 0
      ? (financial.monthlyResult / financial.monthlyIncome) * 100
      : 0
  );

  const paymentRows: PaymentRow[] = Object.entries(paymentByMethod ?? {})
    .map(([method, total]) => ({ method, total }))
    .sort((a, b) => b.total - a.total);

  // Livestock breakdown sorted by count desc
  const byCategoryEntries = Object.entries(livestock.byCategory ?? {})
    .sort(([, a], [, b]) => b - a);

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
              label="Stock Granos"
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
              label="Obligaciones Pendientes"
              value={String(obligations.pendingCount ?? 0)}
              trend={{
                direction: (obligations.pendingCount ?? 0) > 0 ? "down" : "up",
                label: (obligations.pendingCount ?? 0) > 0 ? "por cancelar" : "al día",
              }}
              progress={{
                value: Math.min(100, (obligations.pendingCount ?? 0) * 10),
                color: (obligations.pendingCount ?? 0) > 0 ? "#E07070" : "#4CAF7D",
              }}
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

          {/* ── Middle Row: Hacienda breakdown + Actividad ── */}
          <div
            className="grid gap-3.5"
            style={{ gridTemplateColumns: "1fr 320px" }}
          >
            {/* Stock Hacienda con breakdown */}
            <SectionCard
              title="Stock Hacienda"
              actions={
                <span className="text-[0.7rem] text-neutral-400">
                  {formatNumber(livestock.totalHeads)} cabezas
                </span>
              }
            >
              <div className="flex flex-col gap-2.5">
                {byCategoryEntries.length === 0 ? (
                  <p className="text-[0.8rem] text-neutral-400 py-2 text-center">Sin registros de hacienda</p>
                ) : (
                  byCategoryEntries.map(([cat, count]) => {
                    const pct = livestock.totalHeads > 0
                      ? Math.round((count / livestock.totalHeads) * 100)
                      : 0;
                    const isTerneros = cat === "TERNEROS";
                    return (
                      <div key={cat} className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span
                            className="text-[0.78rem] font-semibold"
                            style={{ color: isTerneros ? "#C0705A" : "#374151" }}
                          >
                            {LIVESTOCK_CATEGORY_LABEL[cat] ?? cat}
                            {isTerneros && (
                              <span
                                className="ml-1.5 text-[0.65rem] font-semibold px-1.5 py-0.5 rounded-full"
                                style={{ background: "#FEF5F0", color: "#C0705A" }}
                              >
                                destacado
                              </span>
                            )}
                          </span>
                          <span className="font-mono text-[0.82rem] font-semibold text-neutral-900">
                            {formatNumber(count)}
                          </span>
                        </div>
                        <div className="rounded-full h-[5px]" style={{ background: "#F0F2EE" }}>
                          <div
                            className="h-[5px] rounded-full"
                            style={{
                              width: `${pct}%`,
                              background: isTerneros ? "#C0705A" : "#C8D84B",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </SectionCard>

            <SectionCard title="Actividad Reciente">
              <ActivityList items={lastMovements} />
            </SectionCard>
          </div>

          {/* ── Obligaciones ────────────────────────────── */}
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

          {/* ── Bottom Row: Financiero + Pagos + Sanidad ── */}
          <div
            className="grid gap-3.5"
            style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
          >
            {/* Resumen financiero */}
            <SectionCard title="Resumen del Mes">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[0.72rem] text-neutral-400 uppercase tracking-wide">Ingresos</span>
                  <span className="text-[1.4rem] font-bold font-mono tracking-tight text-green-600">
                    {formatCurrency(financial.monthlyIncome)}
                  </span>
                  <div className="rounded h-[4px]" style={{ background: "#F0F2EE" }}>
                    <div className="h-[4px] rounded" style={{ width: "100%", background: "#4CAF7D" }} />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[0.72rem] text-neutral-400 uppercase tracking-wide">Egresos</span>
                  <span className="text-[1.4rem] font-bold font-mono tracking-tight" style={{ color: "#E07070" }}>
                    {formatCurrency(financial.monthlyExpense)}
                  </span>
                  <div className="rounded h-[4px]" style={{ background: "#F0F2EE" }}>
                    <div
                      className="h-[4px] rounded"
                      style={{
                        width: financial.monthlyIncome > 0
                          ? `${Math.min(100, (financial.monthlyExpense / financial.monthlyIncome) * 100)}%`
                          : "0%",
                        background: "#E07070",
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[0.72rem] text-neutral-400 uppercase tracking-wide">Resultado</span>
                  <span
                    className="text-[1.4rem] font-bold font-mono tracking-tight"
                    style={{ color: monthlyResultPositive ? "#2E6B52" : "#C0505A" }}
                  >
                    {formatCurrency(financial.monthlyResult)}
                  </span>
                </div>
              </div>
            </SectionCard>

            {/* Pagos por método */}
            <SectionCard title="Pagos por Método">
              <DataTable<PaymentRow>
                columns={PAYMENT_COLS}
                rows={paymentRows}
                getRowKey={(row) => row.method}
                emptyMessage="Sin pagos con método registrado"
              />
            </SectionCard>

            {/* Últimos registros sanitarios */}
            <SectionCard title="Últimos Registros Sanitarios">
              <DataTable<HealthRecord>
                columns={HEALTH_COLS}
                rows={latestHealthRecords ?? []}
                getRowKey={(row) => row.id}
                emptyMessage="Sin registros sanitarios"
              />
            </SectionCard>
          </div>

        </div>
      </div>
    </>
  );
}
