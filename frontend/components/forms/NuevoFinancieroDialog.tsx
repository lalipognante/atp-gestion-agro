"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createFinancialMovement } from "@/services/mutations";
import { ApiError } from "@/services/api";
import type { Campaign } from "@/types";

const CATEGORIES_BY_DIRECTION: Record<string, { value: string; label: string }[]> = {
  INCOME: [
    { value: "VENTA_CEREALES", label: "Venta de Cereales" },
    { value: "CATTLE_SALE", label: "Venta Hacienda" },
    { value: "SUBSIDIO", label: "Subsidio" },
    { value: "OTRO_INGRESO", label: "Otro Ingreso" },
  ],
  EXPENSE: [
    { value: "INSUMOS", label: "Insumos" },
    { value: "MANO_DE_OBRA", label: "Mano de Obra" },
    { value: "COMBUSTIBLE", label: "Combustible" },
    { value: "MAQUINARIA", label: "Maquinaria / Servicios" },
    { value: "OBLIGATION_RENT", label: "Alquiler" },
    { value: "OBLIGATION_CREDIT", label: "Crédito" },
    { value: "OTRO_EGRESO", label: "Otro Egreso" },
  ],
};

interface Props {
  campaigns: Campaign[];
}

export function NuevoFinancieroDialog({ campaigns }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [direction, setDirection] = useState<"INCOME" | "EXPENSE">("INCOME");

  function open() {
    setError(null);
    setSuccess(false);
    setDirection("INCOME");
    dialogRef.current?.showModal();
  }
  function close() {
    dialogRef.current?.close();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const dir = fd.get("direction") as "INCOME" | "EXPENSE";
    const category = (fd.get("category") as string) || undefined;
    const amount = parseFloat(fd.get("amount") as string);
    const currency = fd.get("currency") as "ARS" | "USD";
    const campaignId = (fd.get("campaignId") as string) || undefined;
    const date = (fd.get("date") as string) || undefined;

    if (!amount || amount <= 0) { setError("El monto debe ser mayor a 0"); return; }

    setLoading(true);
    try {
      await createFinancialMovement({ direction: dir, category, amount, currency, campaignId, date });
      setSuccess(true);
      router.refresh();
      setTimeout(() => close(), 700);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Error al registrar movimiento";
      try { setError(JSON.parse(msg).message ?? msg); } catch { setError(msg); }
    } finally {
      setLoading(false);
    }
  }

  const categoryOptions = CATEGORIES_BY_DIRECTION[direction] ?? [];

  return (
    <>
      <button
        onClick={open}
        className="inline-flex items-center gap-1.5 bg-green-700 text-white text-[0.78rem] font-semibold px-3.5 py-1.5 rounded-[8px] hover:bg-green-600 transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        Nuevo Movimiento
      </button>

      <dialog
        ref={dialogRef}
        className="rounded-[14px] border border-gray-200 p-6 shadow-xl w-full max-w-sm backdrop:bg-black/40"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[0.95rem] font-bold text-neutral-900">Nuevo Movimiento Financiero</h2>
          <button type="button" onClick={close} className="text-neutral-400 hover:text-neutral-700" aria-label="Cerrar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Dirección *</label>
            <select
              name="direction" value={direction}
              onChange={(e) => setDirection(e.target.value as "INCOME" | "EXPENSE")}
              className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500"
            >
              <option value="INCOME">Ingreso</option>
              <option value="EXPENSE">Egreso</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Categoría</label>
            <select
              name="category"
              className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500"
            >
              <option value="">Sin categoría</option>
              {categoryOptions.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Monto *</label>
              <input
                name="amount" type="number" step="0.01" min="0.01" required placeholder="0.00"
                className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Moneda *</label>
              <select
                name="currency" defaultValue="ARS"
                className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500"
              >
                <option value="ARS">ARS</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          {campaigns.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Campaña</label>
              <select
                name="campaignId"
                className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500"
              >
                <option value="">Sin campaña</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>{c.crop} — {c.year}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Fecha</label>
            <input
              name="date" type="date"
              className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500"
            />
          </div>

          {error && (
            <p className="text-[0.78rem] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}
          {success && (
            <p className="text-[0.78rem] text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              Movimiento registrado
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
