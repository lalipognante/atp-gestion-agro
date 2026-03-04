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
    <span className="text-[0.7rem] font-semibold px-2 py-0.5 rounded-full" style={styles}>
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

const LIVESTOCK_CATEGORY_COLOR: Record<string, string> = {
  TERNEROS: "#C0705A",
  NOVILLOS: "#3A8A68",
  VACAS:    "#3A5AA0",
  TOROS:    "#7A5A1E",
};

const OBLIGATION_COLS: TableColumn<ObligationItem>[] = [
  {
    key: "concept",
    header: "Concepto",
    render: (row) => <span className="font-medium text-neutral-900">{row.concept}</span>,
  },
  {
    key: "dueDate",
    header: "Vence",
    render: (row) => (
      <span className="text-[0.75rem] text-neutral-400 font-mono">{formatDateShort(row.dueDate)}</span>
    ),
  },
  {
    key: "amount",
    header: "Monto",
    align: "right",
    render: (row) => (
      <span className="font-mono text-[0.78rem]">{formatCurrency(Number(row.amount), row.currency)}</span>
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
      <span className="text-[0.75rem] text-neutral-400 font-mono">{formatDate(row.date)}</span>
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
    render: (row) => <span className="font-mono text-[0.82rem]">{formatNumber(row.quantity)}</span>,
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

interface PaymentRow { method: string; total: number; }

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

// ─── Hacienda compact grid ─────────────────────────────────
function HaciendaCompact({
  byCategory,
}: {
  byCategory: Record<string, number>;
}) {
  const entries = Object.entries(byCategory).sort(([, a], [, b]) => b - a);

  if (entries.length === 0) {
    return (
      <p className="text-[0.8rem] text-neutral-400 py-3 text-center">
        Sin registros de hacienda
      </p>
    );
  }

  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))" }}
    >
      {entries.map(([cat, count]) => {
        const color = LIVESTOCK_CATEGORY_COLOR[cat] ?? "#374151";
        return (
          <div
            key={cat}
            className="flex flex-col items-center justify-center rounded-[10px] py-3 px-2 text-center"
            style={{ background: "#F7F9F6" }}
          >
            <span
              className="text-[1.6rem] font-bold font-mono leading-none"
              style={{ color }}
            >
              {formatNumber(count)}
            </span>
            <span className="text-[0.68rem] font-semibold uppercase tracking-wide text-neutral-500 mt-1">
              {LIVESTOCK_CATEGORY_LABEL[cat] ?? cat}
            </span>
          </div>
        );
      })}
    </div>
  );
}

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

  return (
    <>
      <Header
        title="Dashboard"
        subtitle="Campaña 2024 · Establecimiento La Primavera"
      />

      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-7 flex flex-col gap-5 max-w-[1400px]">

          {/* ── Row 1: KPI cards ─────────────────────── */}
          <div
            className="grid gap-3.5"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}
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
              progress={{ value: stock.totalNetStock > 0 ? 50 : 0, color: "#E07070" }}
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

          {/* ── Row 2: Hacienda compact + Resumen Financiero ── */}
          <div className="grid gap-3.5" style={{ gridTemplateColumns: "1fr 1fr" }}>

            <SectionCard
              title="Stock Hacienda"
              actions={
                <span className="text-[0.7rem] text-neutral-400">
                  {formatNumber(livestock.totalHeads)} cabezas
                </span>
              }
            >
              <HaciendaCompact byCategory={livestock.byCategory ?? {}} />
            </SectionCard>

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
          </div>

          {/* ── Row 3: Obligaciones + Actividad ──────── */}
          <div className="grid gap-3.5" style={{ gridTemplateColumns: "1fr 320px" }}>

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

            <SectionCard title="Actividad Reciente">
              <ActivityList items={lastMovements} />
            </SectionCard>
          </div>

          {/* ── Row 4: Pagos + Sanidad ────────────────── */}
          <div className="grid gap-3.5" style={{ gridTemplateColumns: "1fr 1fr" }}>

            <SectionCard title="Pagos por Método">
              <DataTable<PaymentRow>
                columns={PAYMENT_COLS}
                rows={paymentRows}
                getRowKey={(row) => row.method}
                emptyMessage="Sin pagos con método registrado"
              />
            </SectionCard>

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
