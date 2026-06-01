export const dynamic = "force-dynamic";

import { getThirdPartyWorks } from "@/services/third-party-works";
import { getLots } from "@/services/fields";
import { Header } from "@/components/layout/Header";
import { SectionCard } from "@/components/ui/SectionCard";
import { DataTable, type TableColumn } from "@/components/ui/DataTable";
import { PageIntro, SummaryMetric } from "@/components/ui/ProductPage";
import { RegistrarLaborDialog } from "@/components/forms/RegistrarLaborDialog";
import { VoidButton } from "@/components/forms/VoidButton";
import { formatNumber, formatDateShort, formatCurrency } from "@/lib/utils";
import type { ThirdPartyWork, Lot } from "@/types";

const WORK_TYPE_LABEL: Record<string, string> = {
  SIEMBRA:         "Siembra",
  FUMIGACION:      "Fumigación",
  COSECHA:         "Cosecha",
  FERTILIZACION:   "Fertilización",
  MOVIMIENTO_SUELO:"Movimiento de Suelo",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING:   "Pendiente",
  PAID:      "Pagado",
  CANCELLED: "Cancelado",
};

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  PENDING:   { bg: "#FFF8EC", color: "#B06A10" },
  PAID:      { bg: "#EEF7F2", color: "#2E6B52" },
  CANCELLED: { bg: "#FEF0F0", color: "#C0505A" },
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  CASH:             "Efectivo",
  TRANSFER:         "Transferencia",
  THIRD_PARTY_CHECK:"Cheque Tercero",
  QUINTALES:        "Quintales",
  OTHER:            "Otro",
};

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_COLORS[status] ?? { bg: "#F0F2EE", color: "#5A6A5A" };
  return (
    <span className="text-[0.7rem] font-semibold px-2 py-0.5 rounded-full" style={style}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

const LABOR_COLS: TableColumn<ThirdPartyWork>[] = [
  {
    key: "date",
    header: "Fecha",
    render: (row) => (
      <span className="text-[0.75rem] text-neutral-400 font-mono whitespace-nowrap">
        {formatDateShort(row.date)}
      </span>
    ),
  },
  {
    key: "workType",
    header: "Tipo",
    render: (row) => (
      <span
        className="text-[0.7rem] font-semibold px-2 py-0.5 rounded-full"
        style={{ background: "#EEF7F2", color: "#1E7A4E" }}
      >
        {WORK_TYPE_LABEL[row.workType] ?? row.workType}
      </span>
    ),
  },
  {
    key: "lot",
    header: "Lote / Campo",
    render: (row) => (
      <span className="text-[0.82rem] text-neutral-700">
        {row.lot?.field?.name ?? "—"}
        {row.lot?.location ? ` · ${row.lot.location}` : ""}
      </span>
    ),
  },
  {
    key: "contractor",
    header: "Contratista",
    render: (row) => (
      <span className="font-medium text-neutral-900 text-[0.82rem]">{row.contractor}</span>
    ),
  },
  {
    key: "paymentMethod",
    header: "Pago",
    render: (row) => (
      <span className="text-[0.78rem] text-neutral-600">
        {PAYMENT_METHOD_LABEL[row.paymentMethod] ?? row.paymentMethod}
        {row.amount
          ? ` · ${formatCurrency(Number(row.amount), row.currency ?? "ARS")}`
          : row.quintales
          ? ` · ${row.quintales} qq${row.grainType ? ` ${row.grainType}` : ""}`
          : ""}
      </span>
    ),
  },
  {
    key: "status",
    header: "Estado",
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: "actions",
    header: "",
    render: (row) => {
      if (row.deletedAt) {
        return <span className="text-[0.68rem] text-neutral-400 italic">Anulado</span>;
      }
      return (
        <div className="flex gap-1.5">
          {row.status === "PENDING" && (
            <VoidButton id={row.id} action="terceros-pay" label="Pagar" />
          )}
          <VoidButton id={row.id} action="terceros-void" label="Anular" />
        </div>
      );
    },
  },
];

// ─── Error UI ─────────────────────────────────────────────
function PageError({ message }: { message: string }) {
  return (
    <div className="flex-1 flex items-center justify-center p-10">
      <div className="text-center max-w-sm">
        <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#FEF0F0" }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
            <path d="M9 6v4M9 13h.01M3 15h12l-6-12-6 12z" stroke="#C0505A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-neutral-900 mb-1">No se pudo cargar Servicios de Terceros</p>
        <p className="text-xs text-neutral-400">{message}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────
export default async function TercerosPage() {
  let works: ThirdPartyWork[];
  let lots: Lot[];
  try {
    [works, lots] = await Promise.all([
      getThirdPartyWorks("EXTERNO"),
      getLots(),
    ]);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error de conexión con el servidor";
    return <PageError message={message} />;
  }

  // Summary by contractor
  const pendingWorks = works.filter((w) => w.status === "PENDING" && !w.deletedAt);
  const totalDeuda = pendingWorks.reduce((acc, w) => acc + (w.amount ? Number(w.amount) : 0), 0);

  const byContractor: Record<string, number> = {};
  for (const w of pendingWorks) {
    if (w.amount) {
      byContractor[w.contractor] = (byContractor[w.contractor] ?? 0) + Number(w.amount);
    }
  }

  return (
    <>
      <Header
        title="Terceros"
        subtitle="Red operativa del establecimiento"
      />

      <div className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-7 flex flex-col gap-5 max-w-[1400px]">
          <PageIntro
            eyebrow="Red operativa"
            title="Contratistas y servicios que mueven la producción."
            description="Trabajos externos, deuda pendiente y actividad reciente organizados por tercero."
            actions={<RegistrarLaborDialog lots={lots} />}
          />

          {/* ── Summary chips ─────────────────────────── */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <SummaryMetric label="Deuda pendiente" value={formatCurrency(totalDeuda)} detail="Servicios externos" tone={totalDeuda > 0 ? "danger" : "positive"} />
            <SummaryMetric label="Labores pendientes" value={String(pendingWorks.length)} detail="Requieren seguimiento" tone={pendingWorks.length > 0 ? "warning" : "positive"} />
            <SummaryMetric label="Contratistas activos" value={String(Object.keys(byContractor).length)} detail="Con saldo pendiente" />
            <SummaryMetric label="Trabajos registrados" value={String(works.length)} detail="Historial externo" />
          </div>

          {/* ── Por proveedor ─────────────────────────── */}
          {Object.keys(byContractor).length > 0 && (
            <SectionCard title="Contratistas con saldo pendiente">
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(byContractor)
                  .sort((a, b) => b[1] - a[1])
                  .map(([contractor, amount]) => (
                    <div
                      key={contractor}
                      className="rounded-[12px] border app-border app-surface-soft px-4 py-3"
                    >
                      <div className="text-[0.82rem] font-bold text-neutral-900">{contractor}</div>
                      <div className="mt-2 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-neutral-400">Saldo a pagar</div>
                      <div className="mt-1 text-[1rem] font-extrabold tabular-nums text-[#C0505A]">{formatCurrency(amount)}</div>
                    </div>
                  ))}
              </div>
            </SectionCard>
          )}

          {/* ── Tabla labores ─────────────────────────── */}
          <SectionCard
            title="Historial de servicios externos"
            actions={
              works.length > 0 ? (
                <span className="text-[0.7rem] text-neutral-400">
                  {works.length} labor{works.length !== 1 ? "es" : ""}
                </span>
              ) : undefined
            }
          >
            <DataTable<ThirdPartyWork>
              columns={LABOR_COLS}
              rows={works}
              getRowKey={(row) => row.id}
              emptyMessage="Sin labores de terceros registradas"
            />
          </SectionCard>

        </div>
      </div>
    </>
  );
}
