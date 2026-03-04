"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createFarmWork } from "@/services/mutations";
import { ApiError } from "@/services/api";
import type { Lot, FarmWorkType } from "@/types";

const INPUT_CLS =
  "w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500";

const WORK_TYPE_LABELS: Record<FarmWorkType, string> = {
  SIEMBRA: "Siembra",
  FUMIGACION: "Fumigación",
  COSECHA: "Cosecha",
  FERTILIZACION: "Fertilización",
  MOVIMIENTO_SUELO: "Movimiento de Suelo",
};

interface Props {
  lots: Lot[];
}

export function NuevaLaborInternaDialog({ lots }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasCost, setHasCost] = useState(false);

  function open() {
    setError(null);
    setSuccess(false);
    setHasCost(false);
    dialogRef.current?.showModal();
  }
  function close() {
    dialogRef.current?.close();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);

    const date = fd.get("date") as string;
    const workType = fd.get("workType") as FarmWorkType;
    const lotId = fd.get("lotId") as string;
    const responsible = (fd.get("responsible") as string).trim() || undefined;
    const notes = (fd.get("notes") as string).trim() || undefined;

    if (!date) { setError("La fecha es obligatoria"); return; }
    if (!lotId) { setError("Seleccioná un lote"); return; }

    const payload: Parameters<typeof createFarmWork>[0] = {
      date,
      workType,
      lotId,
      responsible,
      notes,
    };

    if (hasCost) {
      const cost = parseFloat(fd.get("cost") as string);
      if (!cost || cost <= 0) { setError("El costo debe ser mayor a 0"); return; }
      payload.cost = cost;
      payload.currency = (fd.get("currency") as "ARS" | "USD") || "ARS";
    }

    setLoading(true);
    try {
      await createFarmWork(payload);
      setSuccess(true);
      router.refresh();
      setTimeout(() => close(), 700);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Error al registrar labor";
      try { setError(JSON.parse(msg).message ?? msg); } catch { setError(msg); }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={open}
        className="inline-flex items-center gap-1.5 bg-green-700 text-white text-[0.78rem] font-semibold px-3.5 py-1.5 rounded-[8px] hover:bg-green-600 transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        Nueva Labor
      </button>

      <dialog
        ref={dialogRef}
        className="rounded-[14px] border border-gray-200 p-6 shadow-xl w-full max-w-md backdrop:bg-black/40"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[0.95rem] font-bold text-neutral-900">Nueva Labor Interna</h2>
            <p className="text-[0.72rem] text-neutral-400 mt-0.5">Sin deuda · costo opcional</p>
          </div>
          <button type="button" onClick={close} className="text-neutral-400 hover:text-neutral-700" aria-label="Cerrar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Fecha *</label>
              <input name="date" type="date" required className={INPUT_CLS} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Tipo *</label>
              <select name="workType" required className={INPUT_CLS}>
                {(Object.keys(WORK_TYPE_LABELS) as FarmWorkType[]).map((t) => (
                  <option key={t} value={t}>{WORK_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Lote *</label>
            <select name="lotId" required className={INPUT_CLS}>
              <option value="">Seleccionar lote…</option>
              {lots.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.field?.name ?? "—"}
                  {l.location ? ` — ${l.location}` : ""}
                  {` (${Number(l.surfaceHa)} ha)`}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
              Responsable interno
            </label>
            <input name="responsible" placeholder="Nombre o iniciales…" className={INPUT_CLS} />
          </div>

          {/* Costo opcional */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasCost}
                onChange={(e) => setHasCost(e.target.checked)}
                className="w-4 h-4 accent-green-700"
              />
              <span className="text-[0.82rem] font-medium text-neutral-700">Registrar costo (impacta en Finanzas)</span>
            </label>

            {hasCost && (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Costo *</label>
                  <input
                    name="cost" type="number" step="0.01" min="0.01" placeholder="0.00"
                    className={INPUT_CLS}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Moneda</label>
                  <select name="currency" className={INPUT_CLS}>
                    <option value="ARS">ARS</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Notas</label>
            <input name="notes" placeholder="Observaciones…" className={INPUT_CLS} />
          </div>

          {error && (
            <p className="text-[0.78rem] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}
          {success && (
            <p className="text-[0.78rem] text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              Labor registrada correctamente
            </p>
          )}

          <div className="flex gap-2.5 mt-1">
            <button
              type="submit" disabled={loading}
              className="flex-1 bg-green-700 text-white text-[0.82rem] font-semibold py-2 rounded-[8px] hover:bg-green-600 disabled:opacity-60 transition-colors"
            >
              {loading ? "Guardando…" : "Guardar"}
            </button>
            <button
              type="button" onClick={close}
              className="flex-1 bg-white border border-gray-300 text-gray-700 text-[0.82rem] font-semibold py-2 rounded-[8px] hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
