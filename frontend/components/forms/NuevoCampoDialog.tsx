"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createField } from "@/services/mutations";
import { ApiError } from "@/services/api";

export function NuevoCampoDialog() {
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
    const name = (fd.get("name") as string).trim();
    const type = fd.get("type") as "PROPIO" | "ALQUILADO";

    if (!name) { setError("El nombre es obligatorio"); return; }

    setLoading(true);
    try {
      await createField({ name, type });
      setSuccess(true);
      router.refresh();
      setTimeout(() => close(), 700);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al crear campo");
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
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        Nuevo Campo
      </button>

      <dialog
        ref={dialogRef}
        className="rounded-[14px] border border-gray-200 p-6 shadow-xl w-full max-w-sm backdrop:bg-black/40"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[0.95rem] font-bold text-neutral-900">Nuevo Campo</h2>
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
              Nombre *
            </label>
            <input
              name="name"
              required
              placeholder="Ej: La Primavera Norte"
              className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
              Tipo *
            </label>
            <select
              name="type"
              defaultValue="PROPIO"
              className="w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500"
            >
              <option value="PROPIO">Propio</option>
              <option value="ALQUILADO">Alquilado</option>
            </select>
          </div>

          {error && (
            <p className="text-[0.78rem] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {success && (
            <p className="text-[0.78rem] text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              Campo creado correctamente
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
