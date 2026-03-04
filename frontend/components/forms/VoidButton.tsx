"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/services/api";
import {
  voidStockMovement,
  voidThirdPartyWork,
  markThirdPartyWorkPaid,
  voidLeaseContract,
  voidLeaseDelivery,
  voidHealthRecord,
  voidFarmWork,
} from "@/services/mutations";

export type VoidAction =
  | "stock-void"
  | "terceros-void"
  | "terceros-pay"
  | "campos-contract-void"
  | "campos-delivery-void"
  | "hacienda-void"
  | "labores-void";

const MUTATION_MAP: Record<VoidAction, (id: string) => Promise<unknown>> = {
  "stock-void":            voidStockMovement,
  "terceros-void":         voidThirdPartyWork,
  "terceros-pay":          markThirdPartyWorkPaid,
  "campos-contract-void":  voidLeaseContract,
  "campos-delivery-void":  voidLeaseDelivery,
  "hacienda-void":         voidHealthRecord,
  "labores-void":          voidFarmWork,
};

const CONFIRM_MSG: Record<VoidAction, string> = {
  "stock-void":            "¿Confirmar anulación? Esta acción no se puede revertir.",
  "terceros-void":         "¿Confirmar anulación? Esta acción no se puede revertir.",
  "terceros-pay":          "¿Confirmar pago? Esta acción no se puede revertir.",
  "campos-contract-void":  "¿Confirmar anulación del contrato? Esta acción no se puede revertir.",
  "campos-delivery-void":  "¿Confirmar anulación de la entrega? Esta acción no se puede revertir.",
  "hacienda-void":         "¿Confirmar anulación? Esta acción no se puede revertir.",
  "labores-void":          "¿Confirmar anulación? Esta acción no se puede revertir.",
};

interface VoidButtonProps {
  id: string;
  action: VoidAction;
  label?: string;
}

export function VoidButton({ id, action, label = "Anular" }: VoidButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (!confirm(CONFIRM_MSG[action])) return;
    setLoading(true);
    setError(null);
    try {
      await MUTATION_MAP[action](id);
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Error al procesar";
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
