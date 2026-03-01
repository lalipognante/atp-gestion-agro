import { getStockMovements } from "@/services/stockMovements";
import { Header } from "@/components/layout/Header";
import { SectionCard } from "@/components/ui/SectionCard";
import { DataTable, type TableColumn } from "@/components/ui/DataTable";
import { formatNumber, formatDate } from "@/lib/utils";
import type { StockMovementRecord } from "@/types";

// ─── Movement type labels ──────────────────────────────────
const MOVEMENT_TYPE_LABEL: Record<string, string> = {
  HARVEST: "Cosecha",
  PURCHASE: "Compra",
  SALE: "Venta",
  TRANSFER: "Transferencia",
  ADJUSTMENT: "Ajuste",
  INTERNAL_CONSUMPTION: "Consumo Interno",
};

const MOVEMENT_TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  HARVEST:             { bg: "#FAFBE8", color: "#7A8A10" },
  PURCHASE:            { bg: "#EEF7F2", color: "#2E6B52" },
  SALE:                { bg: "#FEF0F0", color: "#C0505A" },
  TRANSFER:            { bg: "#F0F4FF", color: "#3A5AA0" },
  ADJUSTMENT:          { bg: "#FEF5F0", color: "#C0705A" },
  INTERNAL_CONSUMPTION:{ bg: "#F5F0FE", color: "#7A50A0" },
};

function MovementTypeBadge({ type }: { type: string }) {
  const style = MOVEMENT_TYPE_COLORS[type] ?? { bg: "#F0F2EE", color: "#5A6A5A" };
  return (
    <span
      className="text-[0.7rem] font-semibold px-2 py-0.5 rounded-full"
      style={style}
    >
      {MOVEMENT_TYPE_LABEL[type] ?? type}
    </span>
  );
}

const STOCK_COLS: TableColumn<StockMovementRecord>[] = [
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
    key: "product",
    header: "Producto",
    render: (row) => (
      <span className="font-medium text-neutral-900">{row.product}</span>
    ),
  },
  {
    key: "movementType",
    header: "Tipo",
    render: (row) => <MovementTypeBadge type={row.movementType} />,
  },
  {
    key: "quantity",
    header: "Cantidad",
    align: "right",
    render: (row) => (
      <span className="font-mono text-[0.82rem]">
        {formatNumber(Number(row.quantity))}
      </span>
    ),
  },
  {
    key: "unit",
    header: "Unidad",
    render: (row) => (
      <span className="text-[0.78rem] text-neutral-500">{row.unit}</span>
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
          No se pudo cargar Stock
        </p>
        <p className="text-xs text-neutral-400">{message}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────
export default async function StockPage() {
  let movements: StockMovementRecord[];
  try {
    movements = await getStockMovements();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error de conexión con el servidor";
    return <PageError message={message} />;
  }

  return (
    <>
      <Header
        title="Stock"
        subtitle="Movimientos de inventario agropecuario"
      />

      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-7 flex flex-col gap-5 max-w-[1400px]">

          <SectionCard
            title="Movimientos de Stock"
            actions={
              movements.length > 0 ? (
                <span className="text-[0.7rem] text-neutral-400">
                  {movements.length} movimiento
                  {movements.length !== 1 ? "s" : ""}
                </span>
              ) : undefined
            }
          >
            <DataTable<StockMovementRecord>
              columns={STOCK_COLS}
              rows={movements}
              getRowKey={(row) => row.id}
              emptyMessage="Sin movimientos de stock registrados"
            />
          </SectionCard>

        </div>
      </div>
    </>
  );
}
