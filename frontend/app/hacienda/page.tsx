import { getHaciendaDashboard } from "@/services/hacienda";
import { Header } from "@/components/layout/Header";
import { KpiCard } from "@/components/ui/KpiCard";
import { SectionCard } from "@/components/ui/SectionCard";
import { DataTable, type TableColumn } from "@/components/ui/DataTable";
import { NuevoHaciendaDialog } from "@/components/forms/NuevoHaciendaDialog";
import { formatCurrency, formatNumber } from "@/lib/utils";

// ─── Category label map ────────────────────────────────────
const CATEGORY_LABEL: Record<string, string> = {
  TERNEROS: "Terneros",
  NOVILLOS: "Novillos",
  VACAS: "Vacas",
  TOROS: "Toros",
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
        {CATEGORY_LABEL[row.category] ?? row.category}
      </span>
    ),
  },
  {
    key: "heads",
    header: "Cabezas",
    align: "right",
    render: (row) => (
      <span className="font-mono text-[0.82rem]">
        {formatNumber(row.heads)}
      </span>
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
          No se pudo cargar Hacienda
        </p>
        <p className="text-xs text-neutral-400">{message}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────
export default async function HaciendaPage() {
  let data;
  try {
    data = await getHaciendaDashboard();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error de conexión con el servidor";
    return <PageError message={message} />;
  }

  const categoryRows: CategoryRow[] = Object.entries(data.byCategory)
    .map(([category, heads]) => ({ category, heads }))
    .sort((a, b) => b.heads - a.heads);

  return (
    <>
      <Header
        title="Hacienda"
        subtitle="Rodeo y movimientos ganaderos"
        actions={<NuevoHaciendaDialog />}
      />

      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-7 flex flex-col gap-5 max-w-[1400px]">

          {/* ── KPI Row ─────────────────────────────────── */}
          <div
            className="grid gap-3.5"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
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
              progress={{
                value: data.totalCattleSaleIncome > 0 ? 60 : 0,
                color: "#4CAF7D",
              }}
              accentBorder
              valueColor={data.totalCattleSaleIncome > 0 ? "#2E6B52" : "#C0505A"}
            />
          </div>

          {/* ── By Category Table ────────────────────────── */}
          <SectionCard
            title="Distribución por Categoría"
            actions={
              categoryRows.length > 0 ? (
                <span className="text-[0.7rem] text-neutral-400">
                  {categoryRows.length} categoría
                  {categoryRows.length !== 1 ? "s" : ""}
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

        </div>
      </div>
    </>
  );
}
