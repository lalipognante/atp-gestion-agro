import { getFinancialMovements } from "@/services/financialMovements";
import { Header } from "@/components/layout/Header";
import { KpiCard } from "@/components/ui/KpiCard";
import { SectionCard } from "@/components/ui/SectionCard";
import { DataTable, type TableColumn } from "@/components/ui/DataTable";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { FinancialMovementRecord } from "@/types";

// ─── Direction badge ───────────────────────────────────────
function DirectionBadge({ direction }: { direction: "INCOME" | "EXPENSE" }) {
  const isIncome = direction === "INCOME";
  return (
    <span
      className="text-[0.7rem] font-semibold px-2 py-0.5 rounded-full"
      style={
        isIncome
          ? { background: "#EEF7F2", color: "#2E6B52" }
          : { background: "#FEF0F0", color: "#C0505A" }
      }
    >
      {isIncome ? "Ingreso" : "Egreso"}
    </span>
  );
}

const FINANCIAL_COLS: TableColumn<FinancialMovementRecord>[] = [
  {
    key: "date",
    header: "Fecha",
    render: (row) => (
      <span className="text-[0.75rem] text-neutral-400 font-mono">
        {formatDate(row.createdAt)}
      </span>
    ),
  },
  {
    key: "direction",
    header: "Tipo",
    render: (row) => <DirectionBadge direction={row.direction} />,
  },
  {
    key: "category",
    header: "Categoría",
    render: (row) => (
      <span className="text-[0.82rem] text-neutral-600">
        {row.category ?? "—"}
      </span>
    ),
  },
  {
    key: "amount",
    header: "Monto",
    align: "right",
    render: (row) => (
      <span
        className="font-mono text-[0.82rem] font-semibold"
        style={{ color: row.direction === "INCOME" ? "#2E6B52" : "#C0505A" }}
      >
        {formatCurrency(Number(row.baseCurrencyAmount), row.currency)}
      </span>
    ),
  },
  {
    key: "currency",
    header: "Moneda",
    render: (row) => (
      <span className="text-[0.75rem] text-neutral-400">{row.currency}</span>
    ),
  },
];

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
          No se pudo cargar Finanzas
        </p>
        <p className="text-xs text-neutral-400">{message}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────
export default async function FinanzasPage() {
  let movements: FinancialMovementRecord[];
  try {
    movements = await getFinancialMovements();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error de conexión con el servidor";
    return <PageError message={message} />;
  }

  // Compute monthly KPIs (current month)
  const now = new Date();
  const cm = now.getMonth();
  const cy = now.getFullYear();

  const monthly = movements.filter((m) => {
    const d = new Date(m.createdAt);
    return d.getMonth() === cm && d.getFullYear() === cy;
  });

  let monthlyIncome = 0;
  let monthlyExpense = 0;
  for (const m of monthly) {
    const amount = Number(m.baseCurrencyAmount);
    if (m.direction === "INCOME") monthlyIncome += amount;
    else monthlyExpense += amount;
  }
  const monthlyResult = monthlyIncome - monthlyExpense;
  const resultPositive = monthlyResult >= 0;
  const resultProgress =
    monthlyIncome > 0
      ? Math.min(100, (monthlyResult / monthlyIncome) * 100)
      : 0;

  return (
    <>
      <Header
        title="Finanzas"
        subtitle="Movimientos financieros del establecimiento"
      />

      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-7 flex flex-col gap-5 max-w-[1400px]">

          {/* ── KPI Row ─────────────────────────────────── */}
          <div
            className="grid gap-3.5"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
            role="region"
            aria-label="Indicadores financieros del mes"
          >
            <KpiCard
              label="Ingresos del Mes"
              value={formatCurrency(monthlyIncome)}
              trend={{ direction: "up", label: "mes en curso" }}
              progress={{ value: 100, color: "#4CAF7D" }}
            />
            <KpiCard
              label="Egresos del Mes"
              value={formatCurrency(monthlyExpense)}
              trend={{ direction: monthlyExpense > 0 ? "down" : "up", label: "mes en curso" }}
              progress={{
                value: monthlyIncome > 0
                  ? Math.min(100, (monthlyExpense / monthlyIncome) * 100)
                  : 0,
                color: "#E07070",
              }}
            />
            <KpiCard
              label="Resultado del Mes"
              value={formatCurrency(monthlyResult)}
              trend={{
                direction: resultPositive ? "up" : "down",
                label: resultPositive ? "positivo" : "negativo",
              }}
              progress={{
                value: Math.max(0, resultProgress),
                color: resultPositive ? "#4CAF7D" : "#E07070",
              }}
              accentBorder
              valueColor={resultPositive ? "#2E6B52" : "#C0505A"}
            />
          </div>

          {/* ── Movements Table ──────────────────────────── */}
          <SectionCard
            title="Todos los Movimientos"
            actions={
              movements.length > 0 ? (
                <span className="text-[0.7rem] text-neutral-400">
                  {movements.length} registro
                  {movements.length !== 1 ? "s" : ""}
                </span>
              ) : undefined
            }
          >
            <DataTable<FinancialMovementRecord>
              columns={FINANCIAL_COLS}
              rows={movements}
              getRowKey={(row) => row.id}
              emptyMessage="Sin movimientos financieros registrados"
            />
          </SectionCard>

        </div>
      </div>
    </>
  );
}
