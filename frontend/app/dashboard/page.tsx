"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/utils";
import { getFinancialRecords, computeSummary } from "@/services/financial";
import { Topbar } from "@/components/layout/Topbar";
import { StatCard } from "@/components/ui/StatCard";
import { FinancialTable } from "@/components/FinancialTable";
import { RegisterMovementModal } from "@/components/RegisterMovementModal";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import type { FinancialRecord, DashboardSummary } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [summary, setSummary] = useState<DashboardSummary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
    }
  }, [router]);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getFinancialRecords();
      setRecords(data);
      setSummary(computeSummary(data));
    } catch (err) {
      if (err instanceof Error && (err as { status?: number }).status === 401) {
        router.replace("/login");
        return;
      }
      setError("No se pudieron cargar los datos. Verificá tu conexión.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function handleModalSuccess() {
    setShowModal(false);
    fetchData();
  }

  const balancePositive = summary.balance >= 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Topbar />

      <main className="flex-1 px-6 py-7 max-w-7xl mx-auto w-full">
        {/* Page header */}
        <div className="flex items-start justify-between mb-7">
          <div>
            <h1 className="font-display text-[26px] font-normal text-gray-900 leading-tight">
              Resumen financiero
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Todos los movimientos · actualizado al momento
            </p>
          </div>
          <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Registrar movimiento
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-7">
          <StatCard
            accent
            label="Total ingresos"
            value={formatCurrency(summary.totalIncome)}
            sub="Suma de todos los INCOME"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 20V4M5 11l7-7 7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
          <StatCard
            label="Total egresos"
            value={formatCurrency(summary.totalExpense)}
            sub="Suma de todos los EXPENSE"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 4v16M5 13l7 7 7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
          <StatCard
            label="Balance"
            value={formatCurrency(summary.balance)}
            sub={balancePositive ? "Resultado positivo ▲" : "Resultado negativo ▼"}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                <path
                  d="M3 12h18M3 6l9 6-9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
        </div>

        {/* Table section */}
        <div className="bg-white rounded-[10px] border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">
              Movimientos financieros
            </h2>
            <span className="text-xs text-gray-400">
              {records.length} registro{records.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span className="text-sm">Cargando movimientos…</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-sm text-red-500 mb-3">{error}</p>
              <Button variant="secondary" size="sm" onClick={fetchData}>
                Reintentar
              </Button>
            </div>
          ) : (
            <FinancialTable records={records} />
          )}
        </div>
      </main>

      {showModal && (
        <RegisterMovementModal
          onClose={() => setShowModal(false)}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
