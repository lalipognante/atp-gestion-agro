export const dynamic = "force-dynamic";

import { getFinancialMovements } from "@/services/financialMovements";
import { getObligations } from "@/services/obligations";
import { getEmployees, getSalaryPayments, getSalaryAdvances } from "@/services/employees";
import { getCampaigns } from "@/services/campaigns";
import { Header } from "@/components/layout/Header";
import { KpiCard } from "@/components/ui/KpiCard";
import { SectionCard } from "@/components/ui/SectionCard";
import { DataTable, type TableColumn } from "@/components/ui/DataTable";
import { PageIntro } from "@/components/ui/ProductPage";
import { NuevoFinancieroDialog } from "@/components/forms/NuevoFinancieroDialog";
import { NuevaObligacionDialog } from "@/components/forms/NuevaObligacionDialog";
import { MarcarPagadaButton } from "@/components/forms/MarcarPagadaButton";
import { NuevoPagoSalarioDialog } from "@/components/forms/NuevoPagoSalarioDialog";
import { formatCurrency, formatDate } from "@/lib/utils";
import type {
  FinancialMovementRecord,
  ObligationItem,
  SalaryPayment,
  SalaryAdvance,
} from "@/types";

// ─── Label maps ────────────────────────────────────────────
const CATEGORY_LABEL: Record<string, string> = {
  VENTA_CEREALES: "Venta de Cereales",
  CATTLE_SALE: "Venta de Hacienda",
  STOCK_SALE: "Venta de Stock / Grano",
  STOCK_PURCHASE: "Compra de Stock / Grano",
  THIRD_PARTY_WORK: "Labor de Terceros",
  LABOR_INTERNA: "Labor Propia",
  // Alquiler is stored as string "Alquiler" directly — no mapping needed
  SUBSIDIO: "Subsidio",
  OTRO_INGRESO: "Otro Ingreso",
  INSUMOS: "Insumos",
  MANO_DE_OBRA: "Mano de Obra / Sueldos",
  COMBUSTIBLE: "Combustible",
  MAQUINARIA: "Maquinaria / Labores",
  OBLIGATION_RENT: "Alquiler",
  OBLIGATION_CREDIT: "Crédito",
  OBLIGATION_SUPPLIER: "Proveedor",
  OBLIGATION_OTHER: "Otro (Obligación)",
  SUELDO: "Sueldo",
  ADELANTO_SUELDO: "Adelanto de Sueldo",
  OTRO_EGRESO: "Otro Egreso",
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  CASH: "Efectivo",
  TRANSFER: "Transferencia",
  THIRD_PARTY_CHECK: "Cheque Terc.",
  QUINTALES: "Quintales",
  OTHER: "Otro",
};

const OBLIGATION_TYPE_LABEL: Record<string, string> = {
  RENT: "Alquiler",
  CREDIT: "Crédito",
  SUPPLIER: "Proveedor",
  OTHER: "Otro",
};

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

// ─── Status badge ──────────────────────────────────────────
function StatusBadge({ status }: { status: "PENDING" | "PAID" }) {
  return (
    <span
      className="text-[0.7rem] font-semibold px-2 py-0.5 rounded-full"
      style={
        status === "PAID"
          ? { background: "#EEF7F2", color: "#2E6B52" }
          : { background: "#FFF8EC", color: "#B06A10" }
      }
    >
      {status === "PAID" ? "Pagada" : "Pendiente"}
    </span>
  );
}

// ─── Table column definitions ──────────────────────────────
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
        {row.category ? (CATEGORY_LABEL[row.category] ?? row.category) : "—"}
      </span>
    ),
  },
  {
    key: "paymentMethod",
    header: "Método",
    render: (row) => (
      <span className="text-[0.75rem] text-neutral-500">
        {row.paymentMethod ? (PAYMENT_METHOD_LABEL[row.paymentMethod] ?? row.paymentMethod) : "—"}
      </span>
    ),
  },
  {
    key: "counterparty",
    header: "Contraparte",
    render: (row) => (
      <span className="text-[0.75rem] text-neutral-500">{row.counterparty ?? "—"}</span>
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

type ObligationRow = ObligationItem & { actions?: never };

const OBLIGATION_COLS: TableColumn<ObligationItem>[] = [
  {
    key: "dueDate",
    header: "Vencimiento",
    render: (row) => (
      <span className="text-[0.75rem] text-neutral-400 font-mono">
        {formatDate(row.dueDate)}
      </span>
    ),
  },
  {
    key: "concept",
    header: "Concepto",
    render: (row) => (
      <span className="text-[0.82rem] font-medium text-neutral-800">{row.concept}</span>
    ),
  },
  {
    key: "type",
    header: "Tipo",
    render: (row) => (
      <span className="text-[0.75rem] text-neutral-500">
        {OBLIGATION_TYPE_LABEL[row.type] ?? row.type}
      </span>
    ),
  },
  {
    key: "amount",
    header: "Monto",
    align: "right",
    render: (row) => (
      <span className="font-mono text-[0.82rem] font-semibold text-neutral-800">
        {formatCurrency(Number(row.amount))}
      </span>
    ),
  },
  {
    key: "status",
    header: "Estado",
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: "action",
    header: "",
    render: (row) =>
      row.status === "PENDING" ? (
        <MarcarPagadaButton obligationId={row.id} />
      ) : null,
  },
];

const SALARY_COLS: TableColumn<SalaryPayment | SalaryAdvance>[] = [
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
    key: "employee",
    header: "Empleado",
    render: (row) => (
      <span className="text-[0.82rem] font-medium text-neutral-800">
        {row.employee?.name ?? "—"}
      </span>
    ),
  },
  {
    key: "amount",
    header: "Monto",
    align: "right",
    render: (row) => (
      <span className="font-mono text-[0.82rem] font-semibold" style={{ color: "#C0505A" }}>
        {formatCurrency(Number(row.amount))}
      </span>
    ),
  },
  {
    key: "notes",
    header: "Notas",
    render: (row) => (
      <span className="text-[0.75rem] text-neutral-400">{row.notes ?? "—"}</span>
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
  let obligations: ObligationItem[];
  let employees: Awaited<ReturnType<typeof getEmployees>>;
  let salaryPayments: SalaryPayment[];
  let salaryAdvances: SalaryAdvance[];
  let campaigns: Awaited<ReturnType<typeof getCampaigns>>;

  try {
    [movements, obligations, employees, salaryPayments, salaryAdvances, campaigns] =
      await Promise.all([
        getFinancialMovements(),
        getObligations(),
        getEmployees(),
        getSalaryPayments(),
        getSalaryAdvances(),
        getCampaigns(),
      ]);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error de conexión con el servidor";
    return <PageError message={message} />;
  }

  // ─── Monthly KPIs ──────────────────────────────────────────
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

  const pendingObligations = obligations.filter((o) => o.status === "PENDING");
  const totalPending = pendingObligations.reduce((s, o) => s + Number(o.amount), 0);

  // Combine salary rows into one list with a type tag for the table
  const salaryRows: (SalaryPayment & { _kind: "SUELDO" | "ADELANTO" })[] = [
    ...salaryPayments.map((p) => ({ ...p, _kind: "SUELDO" as const })),
    ...salaryAdvances.map((a) => ({ ...a, _kind: "ADELANTO" as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const SALARY_COLS_WITH_TYPE: TableColumn<typeof salaryRows[number]>[] = [
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
      key: "employee",
      header: "Empleado",
      render: (row) => (
        <span className="text-[0.82rem] font-medium text-neutral-800">
          {row.employee?.name ?? "—"}
        </span>
      ),
    },
    {
      key: "kind",
      header: "Tipo",
      render: (row) => (
        <span
          className="text-[0.7rem] font-semibold px-2 py-0.5 rounded-full"
          style={
            row._kind === "SUELDO"
              ? { background: "#EEF7F2", color: "#1E7A4E" }
              : { background: "#FFF8EC", color: "#B06A10" }
          }
        >
          {row._kind === "SUELDO" ? "Sueldo" : "Adelanto"}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Monto",
      align: "right",
      render: (row) => (
        <span className="font-mono text-[0.82rem] font-semibold" style={{ color: "#C0505A" }}>
          {formatCurrency(Number(row.amount))}
        </span>
      ),
    },
    {
      key: "notes",
      header: "Notas",
      render: (row) => (
        <span className="text-[0.75rem] text-neutral-400">{row.notes ?? "—"}</span>
      ),
    },
  ];

  return (
    <>
      <Header
        title="Finanzas"
        subtitle="Movimientos financieros del establecimiento"
      />

      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-7 flex flex-col gap-5 max-w-[1400px]">
          <PageIntro
            eyebrow="Economía"
            title="Caja, compromisos y pagos del establecimiento."
            description="Una lectura ordenada del mes: qué ingresó, qué salió y qué obligaciones requieren seguimiento."
            actions={<NuevoFinancieroDialog campaigns={campaigns} />}
          />

          <section className="rounded-card border border-green-800 bg-green-950 p-5 text-white app-shadow">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:items-end">
              <div>
                <div className="text-[0.66rem] font-extrabold uppercase tracking-[0.15em] text-accent">Resultado del mes</div>
                <div className={`mt-2 text-[2rem] font-extrabold tracking-[-0.08em] tabular-nums ${resultPositive ? "text-white" : "text-[#F1A2A2]"}`}>{formatCurrency(monthlyResult)}</div>
                <div className="mt-1 text-[0.75rem] text-white/55">{resultPositive ? "Balance positivo del período actual" : "El balance del período requiere atención"}</div>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                <div className="rounded-[12px] border border-white/10 bg-white/[0.06] px-4 py-3">
                  <div className="text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-white/50">Ingresos</div>
                  <div className="mt-2 text-[1rem] font-extrabold tabular-nums text-accent">{formatCurrency(monthlyIncome)}</div>
                </div>
                <div className="rounded-[12px] border border-white/10 bg-white/[0.06] px-4 py-3">
                  <div className="text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-white/50">Egresos</div>
                  <div className="mt-2 text-[1rem] font-extrabold tabular-nums text-[#F1A2A2]">{formatCurrency(monthlyExpense)}</div>
                </div>
                <div className="rounded-[12px] border border-white/10 bg-white/[0.06] px-4 py-3">
                  <div className="text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-white/50">A pagar</div>
                  <div className="mt-2 text-[1rem] font-extrabold tabular-nums text-white">{formatCurrency(totalPending)}</div>
                </div>
              </div>
            </div>
          </section>

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
              progress={{ value: 100, color: "#1E7A4E" }}
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
                color: resultPositive ? "#1E7A4E" : "#D16B6B",
              }}
              accentBorder
              valueColor={resultPositive ? "#1E7A4E" : "#C0505A"}
            />
            <KpiCard
              label="Obligaciones Pendientes"
              value={formatCurrency(totalPending)}
              trend={{
                direction: pendingObligations.length > 0 ? "down" : "up",
                label: `${pendingObligations.length} pendiente${pendingObligations.length !== 1 ? "s" : ""}`,
              }}
              progress={{
                value: pendingObligations.length > 0 ? 100 : 0,
                color: "#E07070",
              }}
              valueColor={pendingObligations.length > 0 ? "#C0505A" : undefined}
            />
          </div>

          {/* ── Movements Table ──────────────────────────── */}
          <SectionCard
            title="Actividad financiera reciente"
            actions={
              movements.length > 0 ? (
                <span className="text-[0.7rem] text-neutral-400">
                  {movements.length} registro{movements.length !== 1 ? "s" : ""}
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

          {/* ── Obligaciones ─────────────────────────────── */}
          <SectionCard
            title="Cuentas a pagar"
            actions={
              <div className="flex items-center gap-2.5">
                {obligations.length > 0 && (
                  <span className="text-[0.7rem] text-neutral-400">
                    {obligations.length} registro{obligations.length !== 1 ? "s" : ""}
                  </span>
                )}
                <NuevaObligacionDialog />
              </div>
            }
          >
            <DataTable<ObligationItem>
              columns={OBLIGATION_COLS}
              rows={obligations}
              getRowKey={(row) => row.id}
              emptyMessage="Sin obligaciones registradas"
            />
          </SectionCard>

          {/* ── Sueldos y Adelantos ──────────────────────── */}
          <SectionCard
            title="Sueldos y Adelantos"
            actions={
              <div className="flex items-center gap-2.5">
                {salaryRows.length > 0 && (
                  <span className="text-[0.7rem] text-neutral-400">
                    {salaryRows.length} registro{salaryRows.length !== 1 ? "s" : ""}
                  </span>
                )}
                <NuevoPagoSalarioDialog employees={employees} />
              </div>
            }
          >
            <DataTable<typeof salaryRows[number]>
              columns={SALARY_COLS_WITH_TYPE}
              rows={salaryRows}
              getRowKey={(row) => row.id}
              emptyMessage="Sin pagos de personal registrados"
            />
          </SectionCard>

        </div>
      </div>
    </>
  );
}
