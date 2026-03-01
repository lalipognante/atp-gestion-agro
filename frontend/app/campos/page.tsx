import { getFields, getLots } from "@/services/fields";
import { Header } from "@/components/layout/Header";
import { SectionCard } from "@/components/ui/SectionCard";
import { DataTable, type TableColumn } from "@/components/ui/DataTable";
import { NuevoCampoDialog } from "@/components/forms/NuevoCampoDialog";
import { NuevoLoteDialog } from "@/components/forms/NuevoLoteDialog";
import { formatNumber } from "@/lib/utils";
import type { Lot, Field } from "@/types";

// ─── Field type badge ──────────────────────────────────────
function FieldTypeBadge({ type }: { type: string }) {
  const isPropio = type === "PROPIO";
  return (
    <span
      className="text-[0.7rem] font-semibold px-2 py-0.5 rounded-full"
      style={
        isPropio
          ? { background: "#EEF7F2", color: "#2E6B52" }
          : { background: "#F0F4FF", color: "#3A5AA0" }
      }
    >
      {isPropio ? "Propio" : "Alquilado"}
    </span>
  );
}

const LOT_COLS: TableColumn<Lot>[] = [
  {
    key: "field",
    header: "Campo",
    render: (row) => (
      <span className="font-medium text-neutral-900">
        {row.field?.name ?? "—"}
      </span>
    ),
  },
  {
    key: "fieldType",
    header: "Tipo",
    render: (row) => (
      row.field ? <FieldTypeBadge type={row.field.type} /> : <span>—</span>
    ),
  },
  {
    key: "location",
    header: "Ubicación",
    render: (row) => (
      <span className="text-[0.82rem] text-neutral-600">
        {row.location ?? "—"}
      </span>
    ),
  },
  {
    key: "surfaceHa",
    header: "Superficie",
    align: "right",
    render: (row) => (
      <span className="font-mono text-[0.82rem]">
        {formatNumber(Number(row.surfaceHa))} ha
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
          No se pudo cargar Campos & Lotes
        </p>
        <p className="text-xs text-neutral-400">{message}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────
export default async function CamposPage() {
  let lots: Lot[];
  let fields: Field[];
  try {
    [lots, fields] = await Promise.all([getLots(), getFields()]);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error de conexión con el servidor";
    return <PageError message={message} />;
  }

  const totalHa = lots.reduce((acc, l) => acc + Number(l.surfaceHa), 0);
  const fieldIds = new Set(lots.map((l) => l.fieldId));

  return (
    <>
      <Header
        title="Campos & Lotes"
        subtitle="Estructura predial del establecimiento"
        actions={
          <>
            <NuevoLoteDialog fields={fields} />
            <NuevoCampoDialog />
          </>
        }
      />

      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-7 flex flex-col gap-5 max-w-[1400px]">

          {/* ── Summary chips ────────────────────────────── */}
          <div className="flex gap-3 flex-wrap">
            <div className="bg-white rounded-[14px] border border-gray-200 px-4 py-3 flex items-center gap-3">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-neutral-400">
                Campos
              </span>
              <span className="text-[1.4rem] font-bold font-mono text-neutral-900">
                {fieldIds.size}
              </span>
            </div>
            <div className="bg-white rounded-[14px] border border-gray-200 px-4 py-3 flex items-center gap-3">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-neutral-400">
                Lotes
              </span>
              <span className="text-[1.4rem] font-bold font-mono text-neutral-900">
                {lots.length}
              </span>
            </div>
            <div className="bg-white rounded-[14px] border border-gray-200 px-4 py-3 flex items-center gap-3">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-neutral-400">
                Superficie Total
              </span>
              <span className="text-[1.4rem] font-bold font-mono text-neutral-900">
                {formatNumber(totalHa)} ha
              </span>
            </div>
          </div>

          {/* ── Lots table ───────────────────────────────── */}
          <SectionCard
            title="Lotes por Campo"
            actions={
              lots.length > 0 ? (
                <span className="text-[0.7rem] text-neutral-400">
                  {lots.length} lote{lots.length !== 1 ? "s" : ""}
                </span>
              ) : undefined
            }
          >
            <DataTable<Lot>
              columns={LOT_COLS}
              rows={lots}
              getRowKey={(row) => row.id}
              emptyMessage="Sin campos ni lotes registrados"
            />
          </SectionCard>

        </div>
      </div>
    </>
  );
}
