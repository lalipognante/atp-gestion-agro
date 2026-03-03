"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createThirdPartyWork } from "@/services/mutations";
import { ApiError } from "@/services/api";
import type { Lot, ThirdPartyWorkType } from "@/types";

const INPUT_CLS =
  "w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500";

const WORK_TYPE_LABELS: Record<ThirdPartyWorkType, string> = {
  SIEMBRA: "Siembra",
  FUMIGACION: "Fumigación",
  COSECHA: "Cosecha",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CASH: "Efectivo",
  TRANSFER: "Transferencia",
  THIRD_PARTY_CHECK: "Cheque Tercero",
  QUINTALES: "Quintales",
  OTHER: "Otro",
};

interface Props {
  lots: Lot[];
}

export function RegistrarLaborDialog({ lots }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("CASH");

  const isQuintales = paymentMethod === "QUINTALES";

  function open() {
    setError(null);
    setSuccess(false);
    setPaymentMethod("CASH");
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
    const workType = fd.get("workType") as ThirdPartyWorkType;
    const lotId = fd.get("lotId") as string;
    const contractor = (fd.get("contractor") as string).trim();
    const reference = (fd.get("reference") as string).trim() || undefined;
    const notes = (fd.get("notes") as string).trim() || undefined;

    if (!date) { setError("La fecha es obligatoria"); return; }
    if (!lotId) { setError("Seleccioná un lote"); return; }
    if (!contractor) { setError("El contratista es obligatorio"); return; }

    const payload: Parameters<typeof createThirdPartyWork>[0] = {
      date,
      workType,
      lotId,
      contractor,
      paymentMethod: paymentMethod as Parameters<typeof createThirdPartyWork>[0]["paymentMethod"],
      reference,
      notes,
    };

    if (isQuintales) {
      const quintales = parseFloat(fd.get("quintales") as string);
      if (!quintales || quintales <= 0) { setError("Los quintales deben ser mayor a 0"); return; }
      payload.quintales = quintales;
      const grainType = (fd.get("grainType") as string).trim() || undefined;
      payload.grainType = grainType;
    } else {
      const amount = parseFloat(fd.get("amount") as string);
      if (!amount || amount <= 0) { setError("El monto debe ser mayor a 0"); return; }
      payload.amount = amount;
      payload.currency = (fd.get("currency") as "ARS" | "USD") || "ARS";
    }

    setLoading(true);
    try {
      await createThirdPartyWork(payload);
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
        Registrar Labor
      </button>

      <dialog
        ref={dialogRef}
        className="rounded-[14px] border border-gray-200 p-6 shadow-xl w-full max-w-md backdrop:bg-black/40"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[0.95rem] font-bold text-neutral-900">Registrar Labor de Terceros</h2>
          <button type="button" onClick={close} className="text-neutral-400 hover:text-neutral-700" aria-label="Cerrar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                Fecha *
              </label>
              <input name="date" type="date" required className={INPUT_CLS} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                Tipo *
              </label>
              <select name="workType" required className={INPUT_CLS}>
                {(Object.keys(WORK_TYPE_LABELS) as ThirdPartyWorkType[]).map((t) => (
                  <option key={t} value={t}>{WORK_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
              Lote *
            </label>
            <select name="lotId" required className={INPUT_CLS}>
              <option value="">Seleccionar lote…</option>
              {lots.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.field?.name ? `${l.field.name}` : ""}
                  {l.location ? ` — ${l.location}` : ""}
                  {` (${Number(l.surfaceHa)} ha)`}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
              Contratista *
            </label>
            <input name="contractor" required placeholder="Nombre del contratista…" className={INPUT_CLS} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
              Forma de Pago *
            </label>
            <select
              name="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className={INPUT_CLS}
            >
              {Object.entries(PAYMENT_METHOD_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>

          {isQuintales ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                  Quintales *
                </label>
                <input
                  name="quintales" type="number" step="0.01" min="0.01" required placeholder="0.00"
                  className={INPUT_CLS}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                  Grano
                </label>
                <input name="grainType" placeholder="Soja, Trigo…" className={INPUT_CLS} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                  Monto *
                </label>
                <input
                  name="amount" type="number" step="0.01" min="0.01" required placeholder="0.00"
                  className={INPUT_CLS}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                  Moneda
                </label>
                <select name="currency" className={INPUT_CLS}>
                  <option value="ARS">ARS</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                Referencia
              </label>
              <input name="reference" placeholder="Nro. contrato…" className={INPUT_CLS} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                Notas
              </label>
              <input name="notes" placeholder="Observaciones…" className={INPUT_CLS} />
            </div>
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
