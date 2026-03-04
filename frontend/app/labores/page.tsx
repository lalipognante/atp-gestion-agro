export const dynamic = "force-dynamic";

import { getFarmWorks } from "@/services/farm-works";
import { getLots } from "@/services/fields";
import { Header } from "@/components/layout/Header";
import { SectionCard } from "@/components/ui/SectionCard";
import { DataTable, type TableColumn } from "@/components/ui/DataTable";
import { NuevaLaborInternaDialog } from "@/components/forms/NuevaLaborInternaDialog";
import { VoidButton } from "@/components/forms/VoidButton";
import { formatDateShort, formatCurrency, formatNumber } from "@/lib/utils";
import type { FarmWork, Lot } from "@/types";

const WORK_TYPE_LABEL: Record<string, string> = {
  SIEMBRA: "Siembra",
  FUMIGACION: "Fumigación",
  COSECHA: "Cosecha",
  FERTILIZACION: "Fertilización",
  MOVIMIENTO_SUELO: "Movimiento de Suelo",
};

const WORK_TYPE_COLOR: Record<string, { bg: string; color: string }> = {
  SIEMBRA:         { bg: "#EEF7F2", color: "#2E6B52" },
  FUMIGACION:      { bg: "#FFF8EC", color: "#B06A10" },
  COSECHA:         { bg: "#F0F4FF", color: "#3A5AA0" },
  FERTILIZACION:   { bg: "#F9F0FF", color: "#7A3AAB" },
  MOVIMIENTO_SUELO:{ bg: "#F5F0E8", color: "#7A5A1E" },
};

const LABOR_COLS: TableColumn<FarmWork>[] = [
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
    render: (row) => {
      const style = WORK_TYPE_COLOR[row.workType] ?? { bg: "#F0F2EE", color: "#5A6A5A" };
      return (
        <span
          className="text-[0.7rem] font-semibold px-2 py-0.5 rounded-full"
          style={style}
        >
          {WORK_TYPE_LABEL[row.workType] ?? row.workType}
        </span>
      );
    },
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
    key: "responsible",
    header: "Responsable",
    render: (row) => (
      <span className="text-[0.82rem] text-neutral-600">
        {row.responsible ?? <span className="text-neutral-300">—</span>}
      </span>
    ),
  },
  {
    key: "cost",
    header: "Costo",
    align: "right",
    render: (row) =>
      row.cost ? (
        <span className="font-mono text-[0.78rem] text-neutral-700">
          {formatCurrency(Number(row.cost), row.currency ?? "ARS")}
        </span>
      ) : (
        <span className="text-[0.75rem] text-neutral-300">—</span>
      ),
  },
  {
    key: "notes",
    header: "Notas",
    render: (row) => (
      <span className="text-[0.75rem] text-neutral-400 truncate max-w-[160px] block">
        {row.notes ?? "—"}
      </span>
    ),
  },
  {
    key: "actions",
    header: "",
    render: (row) =>
      row.deletedAt ? (
        <span className="text-[0.68rem] text-neutral-400 italic">Anulada</span>
      ) : (
        <VoidButton id={row.id} action="labores-void" label="Anular" />
      ),
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
        <p className="text-sm font-semibold text-neutral-900 mb-1">No se pudo cargar Labores</p>
        <p className="text-xs text-neutral-400">{message}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────
export default async function LaboresPage() {
  let works: FarmWork[];
  let lots: Lot[];
  try {
    [works, lots] = await Promise.all([getFarmWorks(), getLots()]);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error de conexión con el servidor";
    return <PageError message={message} />;
  }

  const totalCosto = works.reduce((acc, w) => acc + (w.cost ? Number(w.cost) : 0), 0);

  // Conteo por tipo
  const byType: Record<string, number> = {};
  for (const w of works) {
    if (!w.deletedAt) byType[w.workType] = (byType[w.workType] ?? 0) + 1;
  }

  return (
    <>
      <Header
        title="Labores"
        subtitle="Trabajos internos del establecimiento"
        actions={<NuevaLaborInternaDialog lots={lots} />}
      />

      <div className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-7 flex flex-col gap-5 max-w-[1400px]">

          {/* ── Summary chips ─────────────────────────── */}
          <div className="flex flex-wrap gap-3">
            <div className="bg-white rounded-[14px] border border-gray-200 px-4 py-3 flex items-center gap-3">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-neutral-400">
                Total Labores
              </span>
              <span className="text-[1.4rem] font-bold font-mono text-neutral-900">
                {works.filter((w) => !w.deletedAt).length}
              </span>
            </div>
            {totalCosto > 0 && (
              <div className="bg-white rounded-[14px] border border-gray-200 px-4 py-3 flex items-center gap-3">
                <span className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-neutral-400">
                  Costo Total
                </span>
                <span className="text-[1.4rem] font-bold font-mono text-neutral-900">
                  {formatCurrency(totalCosto)}
                </span>
              </div>
            )}
            {Object.entries(byType).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([type, count]) => (
              <div key={type} className="bg-white rounded-[14px] border border-gray-200 px-4 py-3 flex items-center gap-3">
                <span className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-neutral-400">
                  {WORK_TYPE_LABEL[type] ?? type}
                </span>
                <span className="text-[1.4rem] font-bold font-mono text-neutral-900">{formatNumber(count)}</span>
              </div>
            ))}
          </div>

          {/* ── Tabla labores ─────────────────────────── */}
          <SectionCard
            title="Historial de Labores"
            actions={
              works.length > 0 ? (
                <span className="text-[0.7rem] text-neutral-400">
                  {works.filter((w) => !w.deletedAt).length} labor{works.filter((w) => !w.deletedAt).length !== 1 ? "es" : ""}
                </span>
              ) : undefined
            }
          >
            <DataTable<FarmWork>
              columns={LABOR_COLS}
              rows={works}
              getRowKey={(row) => row.id}
              emptyMessage="Sin labores registradas. Registrá la primera con el botón de arriba."
            />
          </SectionCard>

        </div>
      </div>
    </>
  );
}
