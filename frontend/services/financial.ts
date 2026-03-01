import { api } from "./api";
import type { FinancialRecord, DashboardSummary } from "@/types";

export async function getFinancialRecords(): Promise<FinancialRecord[]> {
  return api.get<FinancialRecord[]>("/financial");
}

export function computeSummary(records: FinancialRecord[]): DashboardSummary {
  let totalIncome = 0;
  let totalExpense = 0;

  for (const record of records) {
    const amount = parseFloat(record.baseCurrencyAmount);
    if (record.direction === "INCOME") {
      totalIncome += amount;
    } else {
      totalExpense += amount;
    }
  }

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
}
