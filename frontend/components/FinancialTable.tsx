import { formatCurrency, formatDate } from "@/lib/utils";
import { DirectionBadge } from "@/components/ui/Badge";
import type { FinancialRecord } from "@/types";

interface FinancialTableProps {
  records: FinancialRecord[];
}

export function FinancialTable({ records }: FinancialTableProps) {
  if (records.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 text-sm">
        No hay movimientos registrados.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left text-[11px] font-semibold uppercase tracking-widest text-gray-500 px-5 py-3">
              Fecha
            </th>
            <th className="text-left text-[11px] font-semibold uppercase tracking-widest text-gray-500 px-4 py-3">
              Tipo
            </th>
            <th className="text-left text-[11px] font-semibold uppercase tracking-widest text-gray-500 px-4 py-3">
              Categoría
            </th>
            <th className="text-left text-[11px] font-semibold uppercase tracking-widest text-gray-500 px-4 py-3">
              Moneda
            </th>
            <th className="text-right text-[11px] font-semibold uppercase tracking-widest text-gray-500 px-5 py-3">
              Monto
            </th>
            <th className="text-right text-[11px] font-semibold uppercase tracking-widest text-gray-500 px-5 py-3">
              Base (ARS)
            </th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr
              key={record.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                {formatDate(record.createdAt)}
              </td>
              <td className="px-4 py-3.5">
                <DirectionBadge direction={record.direction} />
              </td>
              <td className="px-4 py-3.5 text-sm text-gray-600">
                {record.category ?? <span className="text-gray-300">—</span>}
              </td>
              <td className="px-4 py-3.5">
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                  {record.currency}
                </span>
              </td>
              <td className="px-5 py-3.5 text-sm font-semibold text-right tabular-nums text-gray-900">
                {formatCurrency(parseFloat(record.amount), record.currency)}
              </td>
              <td className="px-5 py-3.5 text-sm text-right tabular-nums text-gray-600">
                {formatCurrency(parseFloat(record.baseCurrencyAmount), "ARS")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
