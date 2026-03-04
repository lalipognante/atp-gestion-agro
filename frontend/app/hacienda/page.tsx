export const dynamic = "force-dynamic";

import { getHaciendaDashboard, getHealthRecords, getLivestockMovements } from "@/services/hacienda";
import { Header } from "@/components/layout/Header";
import { KpiCard } from "@/components/ui/KpiCard";
import { SectionCard } from "@/components/ui/SectionCard";
import { DataTable, type TableColumn } from "@/components/ui/DataTable";
import { NuevoHaciendaDialog } from "@/components/forms/NuevoHaciendaDialog";
import { NuevoSanidadDialog } from "@/components/forms/NuevoSanidadDialog";
import { VoidButton } from "@/components/forms/VoidButton";
import { formatCurrency, formatNumber, formatDate } from "@/lib/utils";
import type { HealthRecord, LivestockMovement } from "@/types";

// ─── Category label map ────────────────────────────────────
const CATEGORY_LABEL: Record<string, string> = {
  // V1 groups
  TERNEROS: "Terneros",
  NOVILLOS: "Novillos",
  VACAS:    "Vacas",
  TOROS:    "Toros",
  // V2 individual categories
  TERNERO:    "Ternero",
  TERNERA:    "Ternera",
  NOVILLO:    "Novillo",
  VAQUILLONA: "Vaquillona",
  TORO:       "Toro",
  VACA:       "Vaca",
};

const MOV_TYPE_LABEL: Record<string, string> = {
  INCOME:     "Ingreso",
  PURCHASE:   "Compra",
  SALE:       "Venta",
  DEATH:      "Baja / Muerte",
  TRANSFER:   "Transferencia",
  ADJUSTMENT: "Ajuste",
};

const MOV_TYPE_COLOR: Record<string, { bg: string; color: string }> = {
  INCOME:     { bg: "#EEF7F2", color: "#2E6B52" },
  PURCHASE:   { bg: "#EEF4FF", color: "#3B5FBF" },
  SALE:       { bg: "#FFF8EC", color: "#B06A10" },
  DEATH:      { bg: "#FEF0F0", color: "#C0505A" },
  TRANSFER:   { bg: "#F5F5F5", color: "#555" },
  ADJUSTMENT: { bg: "#F5F5F5", color: "#555" },
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

const MOVEMENT_COLS: TableColumn<LivestockMovement>[] = [
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
    key: "type",
    header: "Tipo",
    render: (row) => {
      const s = MOV_TYPE_COLOR[row.type] ?? { bg: "#F5F5F5", color: "#555" };
      return (
        <span
          className="text-[0.7rem] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
          style={s}
        >
          {MOV_TYPE_LABEL[row.type] ?? row.type}
        </span>
      );
    },
  },
  {
    key: "category",
    header: "Categoría",
    render: (row) => {
      // If V2 items exist, show them as a compact list
      if (row.items && row.items.length > 0) {
        return (
          <span className="text-[0.78rem] text-neutral-700">
            {row.items.map((it) => `${CATEGORY_LABEL[it.category] ?? it.category} ×${it.quantity}`).join(", ")}
          </span>
        );
      }
      return (
        <span className="text-[0.82rem] text-neutral-700">
          {CATEGORY_LABEL[row.category] ?? row.category}
        </span>
      );
    },
  },
  {
    key: "quantity",
    header: "Cabezas",
    align: "right",
    render: (row) => (
      <span className="font-mono text-[0.82rem]">{formatNumber(row.quantity)}</span>
    ),
  },
  {
    key: "weight",
    header: "Kg totales",
    align: "right",
    render: (row) => {
      const kg = row.totalWeightKg ?? null;
      return (
        <span className="font-mono text-[0.82rem] text-neutral-600">
          {kg != null ? `${formatNumber(kg)} kg` : "—"}
        </span>
      );
    },
  },
  {
    key: "pricePerKg",
    header: "$/kg",
    align: "right",
    render: (row) => {
      const ppk = row.pricePerKg ?? null;
      return (
        <span className="font-mono text-[0.82rem] text-neutral-600">
          {ppk != null ? formatCurrency(Number(ppk)) : "—"}
        </span>
      );
    },
  },
  {
    key: "total",
    header: "Total",
    align: "right",
    render: (row) => {
      const amt = row.totalAmount ?? row.totalPrice;
      return (
        <span className="font-mono text-[0.82rem] font-semibold text-neutral-800">
          {amt != null && Number(amt) > 0 ? formatCurrency(Number(amt)) : "—"}
        </span>
      );
    },
  },
  {
    key: "notes",
    header: "Notas",
    render: (row) => (
      <span className="text-[0.75rem] text-neutral-400">{row.notes ?? "—"}</span>
    ),
  },
];

// ─── Page ─────────────────────────────────────────────────
export default async function HaciendaPage() {
  let data;
  let healthRecords: HealthRecord[] = [];
  let movements: LivestockMovement[] = [];
  try {
    [data, healthRecords, movements] = await Promise.all([
      getHaciendaDashboard(),
      getHealthRecords(),
      getLivestockMovements(),
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
              {categoryRows.length === 0 ? (
                <p className="text-[0.82rem] text-neutral-400 py-4 text-center">
                  Sin movimientos registrados
                </p>
              ) : (
                <>
                  <div className="flex items-center justify-between px-[14px] pb-[10px] border-b border-gray-200">
                    <span className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-neutral-400">
                      Categoría
                    </span>
                    <span className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-neutral-400">
                      Cabezas
                    </span>
                  </div>
                  {categoryRows.map((row) => (
                    <div
                      key={row.category}
                      className="flex items-center justify-between px-[14px] py-[11px] border-b border-gray-50 last:border-b-0 hover:bg-neutral-50 transition-colors"
                    >
                      <span className="font-medium text-[0.82rem] text-neutral-900">
                        {CATEGORY_LABEL[row.category] ?? row.category}
                      </span>
                      <span className="font-mono text-[0.82rem] text-neutral-800">
                        {formatNumber(row.heads)}
                      </span>
                    </div>
                  ))}
                </>
              )}
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

          {/* ── Movimientos de Hacienda ──────────────────── */}
          <SectionCard
            title="Movimientos de Hacienda"
            actions={
              movements.length > 0 ? (
                <span className="text-[0.7rem] text-neutral-400">
                  {movements.length} movimiento{movements.length !== 1 ? "s" : ""}
                </span>
              ) : undefined
            }
          >
            <div className="overflow-x-auto">
              <DataTable<LivestockMovement>
                columns={MOVEMENT_COLS}
                rows={movements}
                getRowKey={(row) => row.id}
                emptyMessage="Sin movimientos registrados"
              />
            </div>
          </SectionCard>

        </div>
      </div>
    </>
  );
}
