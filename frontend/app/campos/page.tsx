export const dynamic = "force-dynamic";

import { getFields, getLots } from "@/services/fields";
import { getLeaseContracts } from "@/services/leaseContracts";
import { Header } from "@/components/layout/Header";
import { SectionCard } from "@/components/ui/SectionCard";
import { DataTable, type TableColumn } from "@/components/ui/DataTable";
import { NuevoCampoDialog } from "@/components/forms/NuevoCampoDialog";
import { NuevoLoteDialog } from "@/components/forms/NuevoLoteDialog";
import { NuevoContratoDialog } from "@/components/forms/NuevoContratoDialog";
import { RegistrarEntregaDialog } from "@/components/forms/RegistrarEntregaDialog";
import { VoidButton } from "@/components/forms/VoidButton";
import { formatNumber, formatDateShort, formatCurrency } from "@/lib/utils";
import type { Lot, Field, LeaseContract, LeaseDelivery } from "@/types";

// ─── Field type badge ──────────────────────────────────────
function FieldTypeBadge({ type }: { type: string }) {
  const isPropio = type === "PROPIO";
  return (
    <span
      className="text-[0.7rem] font-semibold px-2 py-0.5 rounded-full"
      style={
        isPropio
          ? { background: "#EEF7F2", color: "#1E7A4E" }
          : { background: "#F3F7E7", color: "#657D1B" }
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
      <span className="font-medium text-neutral-900">{row.field?.name ?? "—"}</span>
    ),
  },
  {
    key: "fieldType",
    header: "Tipo",
    render: (row) => (row.field ? <FieldTypeBadge type={row.field.type} /> : <span>—</span>),
  },
  {
    key: "location",
    header: "Ubicación",
    render: (row) => (
      <span className="text-[0.82rem] text-neutral-600">{row.location ?? "—"}</span>
    ),
  },
  {
    key: "surfaceHa",
    header: "Superficie",
    align: "right",
    render: (row) => (
      <span className="font-mono text-[0.82rem]">{formatNumber(Number(row.surfaceHa))} ha</span>
    ),
  },
];

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  CASH: "Efectivo",
  TRANSFER: "Transferencia",
  THIRD_PARTY_CHECK: "Cheque",
  QUINTALES: "Quintales",
  OTHER: "Otro",
};

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
        <p className="text-sm font-semibold text-neutral-900 mb-1">No se pudo cargar Campos & Lotes</p>
        <p className="text-xs text-neutral-400">{message}</p>
      </div>
    </div>
  );
}

// ─── Lease Contract Section ────────────────────────────────
function LeaseSection({ contracts, fields }: { contracts: LeaseContract[]; fields: Field[] }) {
  if (contracts.length === 0 && fields.filter((f) => f.type === "ALQUILADO").length === 0) {
    return null;
  }

  return (
    <SectionCard
      title="Contratos de Alquiler"
      actions={<NuevoContratoDialog fields={fields.filter((f) => f.type === "ALQUILADO")} />}
    >
      {contracts.length === 0 ? (
        <p className="text-[0.82rem] text-neutral-400 py-4 text-center">
          Sin contratos de alquiler. Creá uno para campos Alquilados.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {contracts.map((c) => {
            const delivered = c.deliveries.reduce((acc, d) => acc + Number(d.quintales), 0);
            const remaining = Number(c.totalQuintales) - delivered;
            const progress = Number(c.totalQuintales) > 0
              ? Math.min(100, (delivered / Number(c.totalQuintales)) * 100)
              : 0;

            const DELIVERY_COLS: TableColumn<LeaseDelivery>[] = [
              {
                key: "date",
                header: "Fecha",
                render: (d) => (
                  <span className="text-[0.75rem] text-neutral-400 font-mono whitespace-nowrap">
                    {formatDateShort(d.date)}
                  </span>
                ),
              },
              {
                key: "quintales",
                header: "Quintales",
                align: "right",
                render: (d) => (
                  <span className="font-mono text-[0.82rem] font-semibold">
                    {formatNumber(Number(d.quintales))} qq
                  </span>
                ),
              },
              {
                key: "amountARS",
                header: "Monto ARS",
                align: "right",
                render: (d) => (
                  <span className="font-mono text-[0.82rem]">
                    {formatCurrency(Number(d.amountARS))}
                  </span>
                ),
              },
              {
                key: "paymentMethod",
                header: "Método",
                render: (d) => (
                  <span className="text-[0.75rem] text-neutral-500">
                    {PAYMENT_METHOD_LABEL[d.paymentMethod] ?? d.paymentMethod}
                  </span>
                ),
              },
              {
                key: "notes",
                header: "Notas",
                render: (d) => (
                  <span className="text-[0.75rem] text-neutral-400">{d.notes ?? "—"}</span>
                ),
              },
              {
                key: "void",
                header: "",
                render: (d) =>
                  d.deletedAt ? (
                    <span className="text-[0.68rem] text-neutral-400 italic">Anulada</span>
                  ) : (
                    <VoidButton id={d.id} action="campos-delivery-void" />
                  ),
              },
            ];

            return (
              <div key={c.id} className="border app-border app-surface-soft rounded-[12px] p-4">
                {/* Contract header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="font-semibold text-[0.9rem] text-neutral-900">
                      {c.field?.name ?? "—"} — {c.year}
                    </div>
                    {c.notes && (
                      <div className="text-[0.75rem] text-neutral-500 mt-0.5">{c.notes}</div>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {!c.deletedAt && <RegistrarEntregaDialog contractId={c.id} />}
                    {!c.deletedAt && <VoidButton id={c.id} action="campos-contract-void" label="Anular Contrato" />}
                    {c.deletedAt && <span className="text-[0.72rem] text-red-400 italic">Anulado</span>}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-[0.72rem] text-neutral-500 mb-1">
                    <span>Entregado: {formatNumber(delivered)} qq</span>
                    <span>Saldo: <strong style={{ color: remaining > 0 ? "#B06A10" : "#1E7A4E" }}>{formatNumber(remaining)} qq</strong></span>
                    <span>Total: {formatNumber(Number(c.totalQuintales))} qq</span>
                  </div>
                  <div className="h-2 app-surface rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${progress}%`,
                        background: progress >= 100 ? "#1E7A4E" : "#B8D94A",
                      }}
                    />
                  </div>
                </div>

                {/* Deliveries table */}
                {c.deliveries.length > 0 && (
                  <DataTable<LeaseDelivery>
                    columns={DELIVERY_COLS}
                    rows={c.deliveries}
                    getRowKey={(d) => d.id}
                    emptyMessage=""
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}

// ─── Page ─────────────────────────────────────────────────
export default async function CamposPage() {
  let lots: Lot[];
  let fields: Field[];
  let contracts: LeaseContract[];
  try {
    [lots, fields, contracts] = await Promise.all([
      getLots(),
      getFields(),
      getLeaseContracts().catch(() => []),
    ]);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error de conexión con el servidor";
    return <PageError message={message} />;
  }

  const totalHa = lots.reduce((acc, l) => acc + Number(l.surfaceHa), 0);
  const fieldIds = new Set(lots.map((l) => l.fieldId));
  const alquiladoFields = fields.filter((f) => f.type === "ALQUILADO");
  const pendingQuintales = contracts.reduce((total, contract) => {
    if (contract.deletedAt) return total;
    const delivered = contract.deliveries.reduce((sum, delivery) => sum + Number(delivery.quintales), 0);
    return total + Math.max(0, Number(contract.totalQuintales) - delivered);
  }, 0);

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
        <div className="p-4 sm:p-6 lg:p-7 flex flex-col gap-5 max-w-[1400px]">

          {/* ── Summary chips ────────────────────────── */}
          <div className="flex gap-3 flex-wrap">
            <div className="app-surface app-shadow rounded-card border app-border px-4 py-3 flex items-center gap-3">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-neutral-400">Campos</span>
              <span className="text-[1.4rem] font-extrabold tabular-nums text-neutral-900">{fields.length}</span>
            </div>
            <div className="app-surface app-shadow rounded-card border app-border px-4 py-3 flex items-center gap-3">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-neutral-400">Lotes</span>
              <span className="text-[1.4rem] font-extrabold tabular-nums text-neutral-900">{lots.length}</span>
            </div>
            <div className="app-surface app-shadow rounded-card border app-border px-4 py-3 flex items-center gap-3">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-neutral-400">Superficie Total</span>
              <span className="text-[1.4rem] font-extrabold tabular-nums text-neutral-900">{formatNumber(totalHa)} ha</span>
            </div>
            {alquiladoFields.length > 0 && (
              <div className="app-surface app-shadow rounded-card border app-border px-4 py-3 flex items-center gap-3">
                <span className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-neutral-400">Saldo Alquiler</span>
                <span className="text-[1.4rem] font-extrabold tabular-nums" style={{ color: "#657D1B" }}>{formatNumber(pendingQuintales)} qq</span>
              </div>
            )}
          </div>

          {/* ── Lotes + Contratos (2 columnas) ──────── */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
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

            <div>
              <LeaseSection contracts={contracts} fields={fields} />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
