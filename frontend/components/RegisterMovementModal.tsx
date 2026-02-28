"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { createStockMovement } from "@/services/stock";
import type { MovementType } from "@/types";

interface RegisterMovementModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const MOVEMENT_TYPES: { value: MovementType; label: string }[] = [
  { value: "HARVEST", label: "Cosecha (HARVEST)" },
  { value: "PURCHASE", label: "Compra (PURCHASE)" },
  { value: "SALE", label: "Venta (SALE)" },
  { value: "TRANSFER", label: "Transferencia (TRANSFER)" },
  { value: "ADJUSTMENT", label: "Ajuste (ADJUSTMENT)" },
  { value: "INTERNAL_CONSUMPTION", label: "Consumo interno" },
];

const UNITS = [
  { value: "tn", label: "Toneladas (tn)" },
  { value: "kg", label: "Kilogramos (kg)" },
  { value: "bolsas", label: "Bolsas" },
  { value: "litros", label: "Litros" },
];

const PRICE_TYPES: MovementType[] = ["SALE", "PURCHASE"];

export function RegisterMovementModal({
  onClose,
  onSuccess,
}: RegisterMovementModalProps) {
  const [form, setForm] = useState({
    product: "",
    movementType: "HARVEST" as MovementType,
    quantity: "",
    unit: "tn",
    campaignId: "",
    pricePerUnit: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showPrice = PRICE_TYPES.includes(form.movementType);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.product.trim()) return setError("El producto es requerido.");
    if (!form.quantity || isNaN(Number(form.quantity)))
      return setError("Ingresá una cantidad válida.");
    if (!form.campaignId.trim()) return setError("El ID de campaña es requerido.");

    try {
      setLoading(true);
      await createStockMovement({
        product: form.product.trim(),
        movementType: form.movementType,
        quantity: Number(form.quantity),
        unit: form.unit,
        campaignId: form.campaignId.trim(),
        ...(showPrice && form.pricePerUnit
          ? { pricePerUnit: Number(form.pricePerUnit) }
          : {}),
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar el movimiento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-green-950/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div>
            <h2 className="font-display text-xl font-normal text-gray-900">
              Registrar movimiento
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Nuevo movimiento de stock
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Movement type toggle */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
              Tipo de movimiento
            </label>
            <div className="grid grid-cols-3 gap-2">
              {MOVEMENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, movementType: type.value }))
                  }
                  className={`px-2 py-2 rounded-lg border text-xs font-semibold text-center transition-all ${
                    form.movementType === type.value
                      ? type.value === "SALE" || type.value === "PURCHASE"
                        ? "border-earth-600 bg-earth-100 text-earth-600"
                        : "border-green-700 bg-green-100 text-green-800"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {type.value}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Producto"
            name="product"
            value={form.product}
            onChange={handleChange}
            placeholder="ej: Soja, Maíz, Girasol"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Cantidad"
              name="quantity"
              type="number"
              min="0"
              step="0.01"
              value={form.quantity}
              onChange={handleChange}
              placeholder="0.00"
            />
            <Select
              label="Unidad"
              name="unit"
              value={form.unit}
              onChange={handleChange}
              options={UNITS}
            />
          </div>

          <Input
            label="ID de Campaña"
            name="campaignId"
            value={form.campaignId}
            onChange={handleChange}
            placeholder="ID de la campaña"
          />

          {/* Price — only visible for SALE/PURCHASE */}
          <div className={showPrice ? "opacity-100" : "opacity-35 pointer-events-none"}>
            <Input
              label="Precio por unidad (opcional)"
              name="pricePerUnit"
              type="number"
              min="0"
              step="0.01"
              value={form.pricePerUnit}
              onChange={handleChange}
              placeholder={showPrice ? "$/unidad" : "Solo para ventas y compras"}
              disabled={!showPrice}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
              {error}
            </p>
          )}
        </form>

        {/* Footer */}
        <div className="flex gap-2.5 px-6 pb-5">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={loading}
            className="flex-1"
            onClick={handleSubmit}
          >
            Guardar movimiento
          </Button>
        </div>
      </div>
    </div>
  );
}
