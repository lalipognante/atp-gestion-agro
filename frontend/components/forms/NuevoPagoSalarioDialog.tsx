"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createSalaryPayment, createSalaryAdvance, createEmployee } from "@/services/mutations";
import { ApiError } from "@/services/api";
import type { Employee } from "@/types";

type PayType = "SUELDO" | "ADELANTO";

const INPUT_CLS =
  "w-full rounded-lg px-3.5 py-2.5 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500";

interface Props {
  employees: Employee[];
}

export function NuevoPagoSalarioDialog({ employees: initialEmployees }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [payType, setPayType] = useState<PayType>("SUELDO");
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [newEmployee, setNewEmployee] = useState("");
  const [addingEmployee, setAddingEmployee] = useState(false);

  function open() {
    setError(null);
    setSuccess(false);
    setPayType("SUELDO");
    dialogRef.current?.showModal();
  }
  function close() {
    dialogRef.current?.close();
  }

  async function handleAddEmployee() {
    const name = newEmployee.trim();
    if (!name) return;
    setAddingEmployee(true);
    try {
      const emp = await createEmployee({ name });
      setEmployees((prev) => [...prev, emp]);
      setNewEmployee("");
    } catch {
      // ignore
    } finally {
      setAddingEmployee(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const employeeId = fd.get("employeeId") as string;
    const date = fd.get("date") as string;
    const amount = parseFloat(fd.get("amount") as string);
    const notes = (fd.get("notes") as string).trim() || undefined;

    if (!employeeId) { setError("Seleccioná un empleado"); return; }
    if (!date) { setError("La fecha es obligatoria"); return; }
    if (!amount || amount <= 0) { setError("El monto debe ser mayor a 0"); return; }

    setLoading(true);
    try {
      if (payType === "SUELDO") {
        await createSalaryPayment({ employeeId, date, amount, notes });
      } else {
        await createSalaryAdvance({ employeeId, date, amount, notes });
      }
      setSuccess(true);
      router.refresh();
      setTimeout(() => close(), 700);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Error al registrar pago";
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
        Nuevo Pago
      </button>

      <dialog
        ref={dialogRef}
        className="rounded-[14px] border border-gray-200 p-6 shadow-xl w-full max-w-sm backdrop:bg-black/40"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[0.95rem] font-bold text-neutral-900">Nuevo Pago de Personal</h2>
          <button type="button" onClick={close} className="text-neutral-400 hover:text-neutral-700" aria-label="Cerrar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Type toggle */}
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            {(["SUELDO", "ADELANTO"] as PayType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setPayType(t)}
                className={[
                  "flex-1 py-2 text-[0.78rem] font-semibold transition-colors",
                  payType === t
                    ? "bg-green-700 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50",
                ].join(" ")}
              >
                {t === "SUELDO" ? "Sueldo" : "Adelanto"}
              </button>
            ))}
          </div>

          {/* Employee selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
              Empleado *
            </label>
            <select name="employeeId" className={INPUT_CLS}>
              <option value="">Seleccionar empleado…</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>

          {/* Quick-add employee */}
          <div className="flex gap-2">
            <input
              value={newEmployee}
              onChange={(e) => setNewEmployee(e.target.value)}
              placeholder="Nuevo empleado…"
              className="flex-1 rounded-lg px-3 py-2 text-sm border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500"
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddEmployee(); } }}
            />
            <button
              type="button"
              onClick={handleAddEmployee}
              disabled={addingEmployee || !newEmployee.trim()}
              className="px-3 py-2 text-[0.78rem] font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors border border-gray-300"
            >
              {addingEmployee ? "…" : "Agregar"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                Monto (ARS) *
              </label>
              <input
                name="amount" type="number" step="0.01" min="0.01" required placeholder="0.00"
                className={INPUT_CLS}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                Fecha *
              </label>
              <input name="date" type="date" required className={INPUT_CLS} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
              Notas
            </label>
            <input name="notes" placeholder="Observaciones…" className={INPUT_CLS} />
          </div>

          {error && (
            <p className="text-[0.78rem] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}
          {success && (
            <p className="text-[0.78rem] text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              {payType === "SUELDO" ? "Sueldo registrado" : "Adelanto registrado"}
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
