"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createLeaseDelivery } from "@/services/mutations";
import { ApiError } from "@/services/api";
import type { PaymentMethod } from "@/types";

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "CASH", label: "Efectivo" },
  { value: "TRANSFER", label: "Transferencia" },
  { value: "THIRD_PARTY_CHECK", label: "Cheque Tercero" },
  { value: "QUINTALES", label: "Quintales" },
  { value: "OTHER", label: "Otro" },
];

interface Props {
  contractId: string;
}

const today = () => new Date().toISOString().split("T")[0];

export function RegistrarEntregaDialog({ contractId }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function open() {
    setError(null);
    setSuccess(false);
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
    const date = fd.get("date") as string || today();
    const quintales = parseFloat(fd.get("quintales") as string);
    const amountARS = parseFloat(fd.get("amountARS") as string);
    const paymentMethod = fd.get("paymentMethod") as PaymentMethod;
    const reference = (fd.get("reference") as string).trim() || undefined;
    const notes = (fd.get("notes") as string).trim() || undefined;

    if (!quintales || quintales <= 0) { setError("Quintales debe ser > 0"); return; }
    if (!amountARS || amountARS <= 0) { setError("Monto ARS debe ser > 0"); return; }

    setLoading(true);
    try {
      await createLeaseDelivery({ contractId, date, quintales, amountARS, paymentMethod, reference, notes });
      setSuccess(true);
      router.refresh();
      setTimeout(() => close(), 700);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Error al registrar entrega";
      try { setError(JSON.parse(msg).message ?? msg); } catch { setError(msg); }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={open}
        className="inline-flex items-center gap-1.5 bg-white border border-gray-300 text-gray-700 text-[0.75rem] font-semibold px-3 py-1.5 rounded-[8px] hover:bg-gray-50 transition-colors"
      >
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        Entrega
      </button>

      <dialog
        ref={dialogRef}
        className="rounded-[14px] border border-gray-200 p-6 shadow-xl w-full max-w-sm backdrop:bg-black/40"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[0.95rem] font-bold text-neutral-900">Registrar Entrega</h2>
          <button type="button" onClick={close} className="text-neutral-400 hover:text-neutral-700" aria-label="Cerrar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Fecha</label>
            <input
              name="date" type="date" defaultValue={today()}
              className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Quintales *</label>
              <input
                name="quintales" type="number" step="0.01" min="0.01" required placeholder="0"
                className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Monto ARS *</label>
              <input
                name="amountARS" type="number" step="0.01" min="0.01" required placeholder="0.00"
                className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Método de Pago *</label>
            <select
              name="paymentMethod" defaultValue="TRANSFER"
              className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500"
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Referencia</label>
            <input
              name="reference" placeholder="N° transferencia, cheque…"
              className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Notas</label>
            <input
              name="notes" placeholder="Observaciones…"
              className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500"
            />
          </div>

          {error && <p className="text-[0.78rem] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
          {success && <p className="text-[0.78rem] text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">Entrega registrada</p>}

          <div className="flex gap-2.5 mt-1">
            <button type="submit" disabled={loading}
              className="flex-1 bg-green-700 text-white text-[0.82rem] font-semibold py-2 rounded-[8px] hover:bg-green-600 disabled:opacity-60 transition-colors">
              {loading ? "Guardando…" : "Guardar"}
            </button>
            <button type="button" onClick={close}
              className="flex-1 bg-white border border-gray-300 text-gray-700 text-[0.82rem] font-semibold py-2 rounded-[8px] hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
