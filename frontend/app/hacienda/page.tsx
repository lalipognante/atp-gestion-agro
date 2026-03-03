export const dynamic = "force-dynamic";

import { getHaciendaDashboard, getHealthRecords } from "@/services/hacienda";
import { Header } from "@/components/layout/Header";
import { KpiCard } from "@/components/ui/KpiCard";
import { SectionCard } from "@/components/ui/SectionCard";
import { DataTable, type TableColumn } from "@/components/ui/DataTable";
import { NuevoHaciendaDialog } from "@/components/forms/NuevoHaciendaDialog";
import { NuevoSanidadDialog } from "@/components/forms/NuevoSanidadDialog";
import { VoidButton } from "@/components/forms/VoidButton";
import { formatCurrency, formatNumber, formatDate } from "@/lib/utils";
import type { HealthRecord } from "@/types";

// ─── V2 category label map ─────────────────────────────────
const CATEGORY_V2_LABEL: Record<string, string> = {
  TERNERO:    "Ternero",
  TERNERA:    "Ternera",
  NOVILLO:    "Novillo",
  VAQUILLONA: "Vaquillona",
  TORO:       "Toro",
  VACA:       "Vaca",
  // Legacy fallback
  TERNEROS: "Terneros",
  NOVILLOS: "Novillos",
  VACAS:    "Vacas",
  TOROS:    "Toros",
};

const LIVESTOCK_TYPE_LABEL: Record<string, string> = {
  TERNERO:    "Terneros",
  TERNERA:    "Terneras",
  NOVILLO:    "Novillos",
  VAQUILLONA: "Vaquillonas",
  TORO:       "Toros",
  VACA:       "Vacas",
};

const TREATMENT_LABEL: Record<string, string> = {
  VACUNA:         "Vacunación",
  BAÑO:           "Baño",
  DESPARASITACION:"Desparasitación",
  OTRO:           "Otro",
};

interface CategoryRow {
  category: string;
  heads: number;
}

const CATEGORY_COLS: TableColumn<CategoryRow>[] = [
  {
    key: "category",
    header: "Categoría",
    render: (row) => (
      <span className="font-medium text-neutral-900">
        {CATEGORY_V2_LABEL[row.category] ?? row.category}
      </span>
    ),
  },
  {
    key: "heads",
    header: "Cabezas",
    align: "right",
    render: (row) => (
      <span className="font-mono text-[0.82rem]">{formatNumber(row.heads)}</span>
    ),
  },
];

const HEALTH_COLS: TableColumn<HealthRecord>[] = [
  {
    key: "date",
    header: "Fecha",
    render: (row) => (
      <span className="text-[0.75rem] text-neutral-400 font-mono whitespace-nowrap">
        {formatDate(row.date)}
      </span>
    ),
  },
  {
    key: "livestockType",
    header: "Categoría",
    render: (row) => (
      <span className="text-[0.82rem] text-neutral-700">
        {LIVESTOCK_TYPE_LABEL[row.livestockType] ?? row.livestockType}
      </span>
    ),
  },
  {
    key: "treatmentType",
    header: "Tratamiento",
    render: (row) => (
      <span
        className="text-[0.7rem] font-semibold px-2 py-0.5 rounded-full"
        style={{ background: "#EEF4FF", color: "#3B5FBF" }}
      >
        {TREATMENT_LABEL[row.treatmentType] ?? row.treatmentType}
      </span>
    ),
  },
  {
    key: "quantity",
    header: "Cant.",
    align: "right",
    render: (row) => (
      <span className="font-mono text-[0.82rem]">
        {row.appliesToAll ? "Todos" : formatNumber(row.quantity)}
      </span>
    ),
  },
  {
    key: "cost",
    header: "Costo Total",
    align: "right",
    render: (row) => {
      const cost = row.totalCost ?? row.cost;
      return (
        <span className="font-mono text-[0.82rem] text-neutral-600">
          {cost ? formatCurrency(Number(cost)) : "—"}
        </span>
      );
    },
  },
  {
    key: "costPerHead",
    header: "Por Cabeza",
    align: "right",
    render: (row) => (
      <span className="font-mono text-[0.82rem] text-neutral-500">
        {row.costPerHead ? formatCurrency(Number(row.costPerHead)) : "—"}
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
  {
    key: "void",
    header: "",
    render: (row) =>
      row.deletedAt ? (
        <span className="text-[0.68rem] text-neutral-400 italic">Anulado</span>
      ) : (
        <VoidButton id={row.id} action="hacienda-void" />
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
            <path d="M9 6v4M9 13h.01M3 15h12l-6-12-6 12z" stroke="#C0505A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-neutral-900 mb-1">No se pudo cargar Hacienda</p>
        <p className="text-xs text-neutral-400">{message}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────
export default async function HaciendaPage() {
  let data;
  let healthRecords: HealthRecord[] = [];
  try {
    [data, healthRecords] = await Promise.all([
      getHaciendaDashboard(),
      getHealthRecords(),
    ]);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error de conexión con el servidor";
    return <PageError message={message} />;
  }

  const categoryRows: CategoryRow[] = Object.entries(data.byCategory)
    .map(([category, heads]) => ({ category, heads }))
    .filter((r) => r.heads > 0)
    .sort((a, b) => b.heads - a.heads);

  return (
    <>
      <Header
        title="Hacienda"
        subtitle="Rodeo y movimientos ganaderos"
        actions={
          <div className="flex gap-2">
            <NuevoSanidadDialog />
            <NuevoHaciendaDialog />
          </div>
        }
      />

      <div className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-7 flex flex-col gap-5 max-w-[1400px]">

          {/* ── KPI Row ─────────────────────────────────── */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5"
            role="region"
            aria-label="Indicadores de hacienda"
          >
            <KpiCard
              label="Total Cabezas"
              value={formatNumber(data.totalHeads)}
              trend={{ direction: "up", label: "rodeo actual" }}
              progress={{ value: 70, color: "#C8D84B" }}
            />
            <KpiCard
              label="Ingreso por Ventas"
              value={formatCurrency(data.totalCattleSaleIncome)}
              trend={{
                direction: data.totalCattleSaleIncome > 0 ? "up" : "down",
                label: "ventas acumuladas",
              }}
              progress={{ value: data.totalCattleSaleIncome > 0 ? 60 : 0, color: "#4CAF7D" }}
              accentBorder
              valueColor={data.totalCattleSaleIncome > 0 ? "#2E6B52" : "#C0505A"}
            />
            <KpiCard
              label="Registros Sanitarios"
              value={String(healthRecords.length)}
              trend={{ direction: "up", label: "total histórico" }}
              progress={{ value: Math.min(100, healthRecords.length * 10), color: "#3B5FBF" }}
            />
          </div>

          {/* ── Middle Row: Distribución + Sanidad ───────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-3.5">
            <SectionCard
              title="Distribución por Categoría"
              actions={
                categoryRows.length > 0 ? (
                  <span className="text-[0.7rem] text-neutral-400">
                    {categoryRows.length} categoría{categoryRows.length !== 1 ? "s" : ""}
                  </span>
                ) : undefined
              }
            >
              <DataTable<CategoryRow>
                columns={CATEGORY_COLS}
                rows={categoryRows}
                getRowKey={(row) => row.category}
                emptyMessage="Sin movimientos registrados"
              />
            </SectionCard>

            {/* ── Sanidad ─────────────────────────────────── */}
            <SectionCard
              title="Registros de Sanidad"
              actions={
                healthRecords.length > 0 ? (
                  <span className="text-[0.7rem] text-neutral-400">
                    {healthRecords.length} registro{healthRecords.length !== 1 ? "s" : ""}
                  </span>
                ) : undefined
              }
            >
              <DataTable<HealthRecord>
                columns={HEALTH_COLS}
                rows={healthRecords}
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
