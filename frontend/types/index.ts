// ─── Auth ─────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

// ─── Financial ────────────────────────────────────────────
export type Direction = "INCOME" | "EXPENSE";
export type Currency = "ARS" | "USD";

export interface FinancialRecord {
  id: string;
  direction: Direction;
  category: string | null;
  amount: string;
  currency: Currency;
  exchangeRateAtCreation: string;
  baseCurrencyAmount: string;
  stockMovementId: string | null;
  createdAt: string;
}

// ─── Stock Movement ───────────────────────────────────────
export type MovementType =
  | "HARVEST"
  | "PURCHASE"
  | "SALE"
  | "TRANSFER"
  | "ADJUSTMENT"
  | "INTERNAL_CONSUMPTION";

export interface CreateStockMovementRequest {
  product: string;
  movementType: MovementType;
  quantity: number;
  unit: string;
  campaignId: string;
  pricePerUnit?: number;
}

export interface StockMovementResponse {
  id: string;
  product: string;
  movementType: string;
  quantity: string;
  unit: string;
  lotId: string | null;
  campaignId: string | null;
  createdAt: string;
}

// ─── Dashboard Summary ────────────────────────────────────
export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}
