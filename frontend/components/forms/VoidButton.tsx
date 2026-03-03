"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/services/api";

interface VoidButtonProps {
  id: string;
  onVoid: (id: string) => Promise<unknown>;
  label?: string;
}

export function VoidButton({ id, onVoid, label = "Anular" }: VoidButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (!confirm("¿Confirmar anulación? Esta acción no se puede revertir.")) return;
    setLoading(true);
    setError(null);
    try {
      await onVoid(id);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Error al anular";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="inline-flex flex-col items-start gap-0.5">
      <button
        onClick={handleClick}
        disabled={loading}
        className="text-[0.72rem] font-semibold px-2 py-0.5 rounded border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-50 transition-colors"
        aria-label={label}
      >
        {loading ? "…" : label}
      </button>
      {error && (
        <span className="text-[0.68rem] text-red-500">{error}</span>
      )}
    </div>
  );
}
