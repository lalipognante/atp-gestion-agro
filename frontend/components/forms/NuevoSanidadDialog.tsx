"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createHealthRecord } from "@/services/mutations";
import { ApiError } from "@/services/api";
import type { LivestockType, TreatmentType } from "@/types";

// Use LivestockType for the field (keeping existing enum for health records)
const LIVESTOCK_TYPES: { value: LivestockType; label: string }[] = [
  { value: "VACA", label: "Vacas" },
  { value: "FEEDLOT", label: "Feedlot" },
  { value: "TERNERO", label: "Terneros" },
];

const TREATMENT_TYPES: { value: TreatmentType; label: string }[] = [
  { value: "VACUNA", label: "Vacunación" },
  { value: "BAÑO", label: "Baño" },
  { value: "DESPARASITACION", label: "Desparasitación" },
  { value: "OTRO", label: "Otro" },
];

export function NuevoSanidadDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [appliesToAll, setAppliesToAll] = useState(false);

  function open() {
    setError(null);
    setSuccess(false);
    setAppliesToAll(false);
    formRef.current?.reset();
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
    const livestockType = fd.get("livestockType") as LivestockType;
    const treatmentType = fd.get("treatmentType") as TreatmentType;
    const quantity = parseInt(fd.get("quantity") as string, 10) || 0;
    const totalCostRaw = fd.get("totalCost") as string;
    const costPerHeadRaw = fd.get("costPerHead") as string;
    const totalCost = totalCostRaw ? parseFloat(totalCostRaw) : undefined;
    const costPerHead = costPerHeadRaw ? parseFloat(costPerHeadRaw) : undefined;
    const notes = (fd.get("notes") as string).trim() || undefined;

    if (!date) { setError("La fecha es obligatoria"); return; }
    if (!appliesToAll && (!quantity || quantity <= 0)) {
      setError("La cantidad debe ser un entero positivo"); return;
    }

    setLoading(true);
    try {
      await createHealthRecord({
        date,
        livestockType,
        treatmentType,
        quantity: appliesToAll ? 0 : quantity,
        appliesToAll,
        totalCost,
        costPerHead,
        notes,
      });
      setSuccess(true);
      router.refresh();
      setTimeout(() => close(), 700);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Error al registrar sanidad";
      try { setError(JSON.parse(msg).message ?? msg); } catch { setError(msg); }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={open}
        className="inline-flex items-center gap-1.5 bg-blue-700 text-white text-[0.78rem] font-semibold px-3.5 py-1.5 rounded-[8px] hover:bg-blue-600 transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        Registrar Sanidad
      </button>

      <dialog
        ref={dialogRef}
        className="rounded-[14px] border border-gray-200 p-6 shadow-xl w-full max-w-sm backdrop:bg-black/40"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[0.95rem] font-bold text-neutral-900">Registro de Sanidad</h2>
          <button type="button" onClick={close} className="text-neutral-400 hover:text-neutral-700" aria-label="Cerrar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Fecha *</label>
            <input
              name="date" type="date" required
              className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Categoría *</label>
              <select
                name="livestockType" defaultValue="VACA"
                className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
              >
                {LIVESTOCK_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Tratamiento *</label>
              <select
                name="treatmentType" defaultValue="VACUNA"
                className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
              >
                {TREATMENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Applies to all toggle */}
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={appliesToAll}
              onChange={(e) => setAppliesToAll(e.target.checked)}
              className="w-4 h-4 accent-blue-600"
            />
            <span className="text-[0.82rem] text-neutral-700">Aplica a TODOS el rodeo</span>
          </label>

          {!appliesToAll && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Cantidad *</label>
              <input
                name="quantity" type="number" min="1" step="1" required={!appliesToAll} placeholder="0"
                className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Costo Total (ARS)</label>
              <input
                name="totalCost" type="number" step="0.01" min="0" placeholder="0.00"
                className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Por Cabeza (ARS)</label>
              <input
                name="costPerHead" type="number" step="0.01" min="0" placeholder="0.00"
                className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Notas</label>
            <input
              name="notes" placeholder="Producto utilizado, dosis…"
              className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-[0.78rem] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
          {success && <p className="text-[0.78rem] text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">Registro guardado</p>}

          <div className="flex gap-2.5 mt-1">
            <button
              type="submit" disabled={loading}
              className="flex-1 bg-blue-700 text-white text-[0.82rem] font-semibold py-2 rounded-[8px] hover:bg-blue-600 disabled:opacity-60 transition-colors"
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
