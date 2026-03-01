"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createLot } from "@/services/mutations";
import { ApiError } from "@/services/api";
import type { Field } from "@/types";

interface Props {
  fields: Field[];
}

export function NuevoLoteDialog({ fields }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function open() {
    setError(null);
    setSuccess(false);
    dialogRef.current?.showModal();
  }
  function close() {
    dialogRef.current?.close();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const fieldId = fd.get("fieldId") as string;
    const surfaceHa = parseFloat(fd.get("surfaceHa") as string);
    const location = (fd.get("location") as string).trim() || undefined;

    if (!fieldId) { setError("Seleccioná un campo"); return; }
    if (!surfaceHa || surfaceHa <= 0) { setError("Superficie debe ser mayor a 0"); return; }

    setLoading(true);
    try {
      await createLot({ fieldId, surfaceHa, location });
      setSuccess(true);
      router.refresh();
      setTimeout(() => close(), 700);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al crear lote");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={open}
        className="inline-flex items-center gap-1.5 bg-white border border-gray-300 text-gray-700 text-[0.78rem] font-semibold px-3.5 py-1.5 rounded-[8px] hover:bg-gray-50 transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        Nuevo Lote
      </button>

      <dialog
        ref={dialogRef}
        className="rounded-[14px] border border-gray-200 p-6 shadow-xl w-full max-w-sm backdrop:bg-black/40"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[0.95rem] font-bold text-neutral-900">Nuevo Lote</h2>
          <button
            type="button"
            onClick={close}
            className="text-neutral-400 hover:text-neutral-700 transition-colors"
            aria-label="Cerrar"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
              Campo *
            </label>
            <select
              name="fieldId"
              required
              className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500"
            >
              <option value="">Seleccionar campo…</option>
              {fields.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
              Superficie (ha) *
            </label>
            <input
              name="surfaceHa"
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="Ej: 120.50"
              className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
              Ubicación
            </label>
            <input
              name="location"
              placeholder="Ej: Sector Norte"
              className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500"
            />
          </div>

          {error && (
            <p className="text-[0.78rem] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {success && (
            <p className="text-[0.78rem] text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              Lote creado correctamente
            </p>
          )}

          <div className="flex gap-2.5 mt-1">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-700 text-white text-[0.82rem] font-semibold py-2 rounded-[8px] hover:bg-green-600 disabled:opacity-60 transition-colors"
            >
              {loading ? "Guardando…" : "Guardar"}
            </button>
            <button
              type="button"
              onClick={close}
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
