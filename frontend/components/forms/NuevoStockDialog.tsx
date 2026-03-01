"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createStockMovement } from "@/services/mutations";
import { ApiError } from "@/services/api";
import type { Campaign, MovementType } from "@/types";

interface Props {
  campaigns: Campaign[];
}

const MOVEMENT_TYPES: { value: MovementType; label: string }[] = [
  { value: "HARVEST", label: "Cosecha" },
  { value: "PURCHASE", label: "Compra" },
  { value: "SALE", label: "Venta" },
  { value: "TRANSFER", label: "Transferencia" },
  { value: "ADJUSTMENT", label: "Ajuste" },
  { value: "INTERNAL_CONSUMPTION", label: "Consumo Interno" },
];

const PRICE_REQUIRED: MovementType[] = ["SALE", "PURCHASE"];

export function NuevoStockDialog({ campaigns }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [movType, setMovType] = useState<MovementType>("HARVEST");

  function open() {
    setError(null);
    setSuccess(false);
    setMovType("HARVEST");
    dialogRef.current?.showModal();
  }
  function close() {
    dialogRef.current?.close();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const product = (fd.get("product") as string).trim();
    const movementType = fd.get("movementType") as MovementType;
    const quantity = parseFloat(fd.get("quantity") as string);
    const unit = (fd.get("unit") as string).trim();
    const campaignId = (fd.get("campaignId") as string) || undefined;
    const pricePerUnit = fd.get("pricePerUnit") ? parseFloat(fd.get("pricePerUnit") as string) : undefined;
    const date = (fd.get("date") as string) || undefined;

    if (!product) { setError("El producto es obligatorio"); return; }
    if (!quantity || quantity <= 0) { setError("La cantidad debe ser mayor a 0"); return; }
    if (!unit) { setError("La unidad es obligatoria"); return; }
    if (PRICE_REQUIRED.includes(movementType) && (!pricePerUnit || pricePerUnit <= 0)) {
      setError("El precio por unidad es obligatorio para Compra/Venta");
      return;
    }

    setLoading(true);
    try {
      await createStockMovement({ product, movementType, quantity, unit, campaignId, pricePerUnit, date });
      setSuccess(true);
      router.refresh();
      setTimeout(() => close(), 700);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Error al crear movimiento";
      // Try to parse NestJS error
      try {
        const parsed = JSON.parse(msg);
        setError(parsed.message ?? msg);
      } catch {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  const needsPrice = PRICE_REQUIRED.includes(movType);

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
          <h2 className="text-[0.95rem] font-bold text-neutral-900">Nuevo Movimiento de Stock</h2>
          <button type="button" onClick={close} className="text-neutral-400 hover:text-neutral-700" aria-label="Cerrar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Producto *</label>
            <input
              name="product" required placeholder="Ej: Soja, Maíz…"
              className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Tipo *</label>
            <select
              name="movementType" value={movType}
              onChange={(e) => setMovType(e.target.value as MovementType)}
              className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500"
            >
              {MOVEMENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Cantidad *</label>
              <input
                name="quantity" type="number" step="0.01" min="0.01" required placeholder="0"
                className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Unidad *</label>
              <input
                name="unit" required placeholder="tn, kg, u…"
                className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          {needsPrice && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                Precio por Unidad (ARS) *
              </label>
              <input
                name="pricePerUnit" type="number" step="0.01" min="0.01" required={needsPrice}
                placeholder="0.00"
                className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500"
              />
            </div>
          )}

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
