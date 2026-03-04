"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createHaciendaMovement } from "@/services/mutations";
import { ApiError } from "@/services/api";
import type { LivestockMovementType, LivestockCategoryV2, LivestockMovementItemInput } from "@/types";

const MOVEMENT_TYPES: { value: LivestockMovementType; label: string }[] = [
  { value: "SALE",       label: "Venta" },
  { value: "PURCHASE",   label: "Compra" },
  { value: "INCOME",     label: "Ingreso" },
  { value: "DEATH",      label: "Baja / Muerte" },
  { value: "TRANSFER",   label: "Transferencia" },
  { value: "ADJUSTMENT", label: "Ajuste" },
];

const CATEGORIES_V2: { value: LivestockCategoryV2; label: string }[] = [
  { value: "TERNERO",    label: "Ternero" },
  { value: "TERNERA",    label: "Ternera" },
  { value: "NOVILLO",    label: "Novillo" },
  { value: "VAQUILLONA", label: "Vaquillona" },
  { value: "TORO",       label: "Toro" },
  { value: "VACA",       label: "Vaca" },
];

const INPUT_CLS =
  "w-full rounded-lg px-3 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500";
const LABEL_CLS = "text-[11px] font-semibold uppercase tracking-widest text-gray-500";

function formatARS(value: number): string {
  return value.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function NuevoHaciendaDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router    = useRouter();

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // ── Type selector ────────────────────────────────────────
  const [movType, setMovType] = useState<LivestockMovementType>("SALE");
  const isSalePurchase = movType === "SALE" || movType === "PURCHASE";

  // ── Bloque 1: datos económicos ───────────────────────────
  const [avgWeightKg,  setAvgWeightKg]  = useState("");
  const [pricePerKg,   setPricePerKg]   = useState("");
  const [totalAmount,  setTotalAmount]  = useState("");
  const [manualTotal,  setManualTotal]  = useState(false);

  // ── Bloque 2: items por categoría ───────────────────────
  const [items, setItems] = useState<LivestockMovementItemInput[]>([
    { category: "TERNERO", quantity: 0 },
  ]);

  // ── Legacy: categoría única ──────────────────────────────
  const [legacyCat,  setLegacyCat]  = useState<LivestockCategoryV2>("VACA");
  const [legacyQty,  setLegacyQty]  = useState("");
  const [date,       setDate]       = useState("");
  const [notes,      setNotes]      = useState("");

  // ── Cálculos derivados ───────────────────────────────────
  const totalAnimals   = items.reduce((s, i) => s + (i.quantity || 0), 0);
  const parsedAvgWt    = parseFloat(avgWeightKg)  || 0;
  const parsedPriceKg  = parseFloat(pricePerKg)   || 0;
  const totalWeightKg  = totalAnimals * parsedAvgWt;
  const autoTotal      = totalWeightKg * parsedPriceKg;

  function recalculate() {
    setTotalAmount(autoTotal > 0 ? autoTotal.toFixed(2) : "");
    setManualTotal(false);
  }

  // Auto-update total when inputs change (unless manual)
  function handleAvgWeightChange(v: string) {
    setAvgWeightKg(v);
    if (!manualTotal) {
      const wt  = totalAnimals * (parseFloat(v) || 0);
      const tot = wt * parsedPriceKg;
      setTotalAmount(tot > 0 ? tot.toFixed(2) : "");
    }
  }

  function handlePricePerKgChange(v: string) {
    setPricePerKg(v);
    if (!manualTotal) {
      const tot = totalWeightKg * (parseFloat(v) || 0);
      setTotalAmount(tot > 0 ? tot.toFixed(2) : "");
    }
  }

  function updateItemCategory(idx: number, cat: LivestockCategoryV2) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, category: cat } : it)));
  }

  function updateItemQty(idx: number, qty: number) {
    const next = items.map((it, i) => (i === idx ? { ...it, quantity: qty } : it));
    setItems(next);
    if (!manualTotal) {
      const newTotal = next.reduce((s, i) => s + (i.quantity || 0), 0) * parsedAvgWt * parsedPriceKg;
      setTotalAmount(newTotal > 0 ? newTotal.toFixed(2) : "");
    }
  }

  function addItem() {
    setItems((prev) => [...prev, { category: "VACA", quantity: 0 }]);
  }

  function removeItem(idx: number) {
    if (items.length <= 1) return;
    const next = items.filter((_, i) => i !== idx);
    setItems(next);
    if (!manualTotal) {
      const newTotal = next.reduce((s, i) => s + (i.quantity || 0), 0) * parsedAvgWt * parsedPriceKg;
      setTotalAmount(newTotal > 0 ? newTotal.toFixed(2) : "");
    }
  }

  function resetForm() {
    setMovType("SALE");
    setAvgWeightKg("");
    setPricePerKg("");
    setTotalAmount("");
    setManualTotal(false);
    setItems([{ category: "TERNERO", quantity: 0 }]);
    setLegacyCat("VACA");
    setLegacyQty("");
    setDate("");
    setNotes("");
    setError(null);
    setSuccess(false);
  }

  function open() {
    resetForm();
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!date) { setError("La fecha es obligatoria"); return; }

    if (isSalePurchase) {
      if (items.length === 0) { setError("Agregá al menos una categoría"); return; }
      if (totalAnimals <= 0)  { setError("La suma de animales debe ser mayor a 0"); return; }
      if (!avgWeightKg || parsedAvgWt <= 0) { setError("El peso promedio es obligatorio"); return; }
      if (!pricePerKg  || parsedPriceKg <= 0) { setError("El precio por kilo es obligatorio"); return; }

      const amount = parseFloat(totalAmount) || 0;
      if (amount <= 0) { setError("El monto total debe ser mayor a 0"); return; }

      setLoading(true);
      try {
        await createHaciendaMovement({
          date,
          type: movType,
          avgWeightKg: parsedAvgWt,
          pricePerKg: parsedPriceKg,
          totalAmount: amount,
          items,
          notes: notes.trim() || undefined,
        });
        setSuccess(true);
        router.refresh();
        setTimeout(() => close(), 700);
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : "Error al registrar movimiento";
        try { setError(JSON.parse(msg).message ?? msg); } catch { setError(msg); }
      } finally {
        setLoading(false);
      }
    } else {
      // Legacy: simple movement
      const qty = parseInt(legacyQty, 10);
      if (!qty || qty <= 0) { setError("La cantidad debe ser un entero positivo"); return; }

      setLoading(true);
      try {
        await createHaciendaMovement({
          date,
          type: movType,
          categoryV2: legacyCat,
          quantity: qty,
          notes: notes.trim() || undefined,
        });
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
  }

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
        className="rounded-[14px] border border-gray-200 p-6 shadow-xl w-full max-w-lg backdrop:bg-black/40"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[0.95rem] font-bold text-neutral-900">Nuevo Movimiento de Hacienda</h2>
          <button
            type="button" onClick={close}
            className="text-neutral-400 hover:text-neutral-700" aria-label="Cerrar"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* ── Fecha + Tipo ─────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={LABEL_CLS}>Fecha *</label>
              <input
                type="date" required value={date}
                onChange={(e) => setDate(e.target.value)}
                className={INPUT_CLS}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={LABEL_CLS}>Tipo *</label>
              <select
                value={movType}
                onChange={(e) => { setMovType(e.target.value as LivestockMovementType); setError(null); }}
                className={INPUT_CLS}
              >
                {MOVEMENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {isSalePurchase ? (
            <>
              {/* ── Bloque 1: Datos económicos ─────────────────── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-green-700">
                    Datos Económicos
                  </span>
                  <div className="flex-1 h-px bg-green-100" />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLS}>Peso prom. (kg) *</label>
                    <input
                      type="number" step="0.1" min="0.1" placeholder="345"
                      value={avgWeightKg}
                      onChange={(e) => handleAvgWeightChange(e.target.value)}
                      className={INPUT_CLS}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLS}>Precio / kg (ARS) *</label>
                    <input
                      type="number" step="1" min="1" placeholder="5600"
                      value={pricePerKg}
                      onChange={(e) => handlePricePerKgChange(e.target.value)}
                      className={INPUT_CLS}
                    />
                  </div>
                </div>

                {/* Resumen auto */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Total animales</div>
                    <div className="text-[0.9rem] font-mono font-semibold text-neutral-900">
                      {totalAnimals.toLocaleString("es-AR")}
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Total kg</div>
                    <div className="text-[0.9rem] font-mono font-semibold text-neutral-900">
                      {totalWeightKg > 0 ? formatARS(totalWeightKg) : "—"}
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Auto ($)</div>
                    <div className="text-[0.9rem] font-mono font-semibold text-green-700">
                      {autoTotal > 0 ? formatARS(autoTotal) : "—"}
                    </div>
                  </div>
                </div>

                {/* Total editable */}
                <div className="flex gap-2">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className={LABEL_CLS}>
                      Total {movType === "SALE" ? "venta" : "compra"} (ARS) *
                      {manualTotal && (
                        <span className="ml-2 text-[10px] text-amber-600 normal-case tracking-normal font-normal">
                          editado manualmente
                        </span>
                      )}
                    </label>
                    <input
                      type="number" step="1" min="1" placeholder="0"
                      value={totalAmount}
                      onChange={(e) => { setTotalAmount(e.target.value); setManualTotal(true); }}
                      className={INPUT_CLS}
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <button
                      type="button"
                      onClick={recalculate}
                      className="px-3 py-2.5 text-[0.75rem] font-semibold text-green-700 border border-green-300 rounded-lg bg-green-50 hover:bg-green-100 transition-colors whitespace-nowrap"
                    >
                      Recalcular
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Bloque 2: Distribución por categoría ────────── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-green-700">
                    Distribución por Categoría
                  </span>
                  <div className="flex-1 h-px bg-green-100" />
                </div>

                <table style={{ width: "100%", tableLayout: "fixed", borderCollapse: "collapse" }}>
                  <colgroup>
                    <col style={{ width: "55%" }} />
                    <col style={{ width: "33%" }} />
                    <col style={{ width: "12%" }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th className="text-left pb-1.5">
                        <span className={LABEL_CLS}>Categoría</span>
                      </th>
                      <th className="text-right pb-1.5 pr-2">
                        <span className={LABEL_CLS}>Cantidad</span>
                      </th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="pr-2 py-1">
                          <select
                            value={item.category}
                            onChange={(e) => updateItemCategory(idx, e.target.value as LivestockCategoryV2)}
                            className={INPUT_CLS}
                          >
                            {CATEGORIES_V2.map((c) => (
                              <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="pr-2 py-1">
                          <input
                            type="number" min="0" step="1" placeholder="0"
                            value={item.quantity || ""}
                            onChange={(e) => updateItemQty(idx, parseInt(e.target.value, 10) || 0)}
                            className={INPUT_CLS + " text-right"}
                          />
                        </td>
                        <td className="py-1 text-center">
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            disabled={items.length <= 1}
                            className="text-neutral-400 hover:text-red-500 disabled:opacity-30 transition-colors"
                            aria-label="Eliminar categoría"
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex items-center justify-between mt-2">
                  <button
                    type="button"
                    onClick={addItem}
                    className="inline-flex items-center gap-1 text-[0.75rem] font-semibold text-green-700 hover:text-green-600 transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                    Agregar categoría
                  </button>
                  <span className="text-[0.78rem] text-neutral-500 font-mono">
                    Total:{" "}
                    <strong className={totalAnimals > 0 ? "text-neutral-900" : "text-neutral-400"}>
                      {totalAnimals.toLocaleString("es-AR")} animales
                    </strong>
                  </span>
                </div>
              </div>
            </>
          ) : (
            /* ── Formulario simple para otros tipos ──────────── */
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className={LABEL_CLS}>Categoría *</label>
                <select
                  value={legacyCat}
                  onChange={(e) => setLegacyCat(e.target.value as LivestockCategoryV2)}
                  className={INPUT_CLS}
                >
                  {CATEGORIES_V2.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={LABEL_CLS}>Cantidad *</label>
                <input
                  type="number" min="1" step="1" placeholder="0"
                  value={legacyQty}
                  onChange={(e) => setLegacyQty(e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
            </div>
          )}

          {/* ── Notas ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-1.5">
            <label className={LABEL_CLS}>Notas</label>
            <input
              placeholder="Observaciones…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={INPUT_CLS}
            />
          </div>

          {error   && <p className="text-[0.78rem] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
          {success && <p className="text-[0.78rem] text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">Movimiento registrado</p>}

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
