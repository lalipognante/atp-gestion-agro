"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { payObligation } from "@/services/mutations";
import { ApiError } from "@/services/api";

interface Props {
  obligationId: string;
}

export function MarcarPagadaButton({ obligationId }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function open() {
    setError(null);
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
    if (!date) { setError("La fecha es obligatoria"); return; }

    setLoading(true);
    try {
      await payObligation(obligationId, date);
      close();
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Error al marcar como pagada";
      try { setError(JSON.parse(msg).message ?? msg); } catch { setError(msg); }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={open}
        className="text-[0.72rem] font-semibold px-2.5 py-1 rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition-colors border border-green-200"
      >
        Marcar pagada
      </button>

      <dialog
        ref={dialogRef}
        className="rounded-[14px] border border-gray-200 p-6 shadow-xl w-full max-w-xs backdrop:bg-black/40"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[0.9rem] font-bold text-neutral-900">Registrar pago</h2>
          <button type="button" onClick={close} className="text-neutral-400 hover:text-neutral-700" aria-label="Cerrar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
              Fecha de pago *
            </label>
            <input
              name="date" type="date" required
              className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500"
            />
          </div>

          {error && (
            <p className="text-[0.78rem] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-2.5">
            <button
              type="submit" disabled={loading}
              className="flex-1 bg-green-700 text-white text-[0.82rem] font-semibold py-2 rounded-[8px] hover:bg-green-600 disabled:opacity-60 transition-colors"
            >
              {loading ? "Guardando…" : "Confirmar"}
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
