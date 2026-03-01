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

// ─── Dashboard Summary (legacy) ───────────────────────────
export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

// ─── Dashboard B1 ─────────────────────────────────────────
export type ObligationStatus = "PENDING" | "PAID";
export type ObligationType   = "RENT" | "CREDIT" | "SUPPLIER" | "OTHER";
export type ObligationCurrency = "ARS" | "USD";

export interface ObligationItem {
  id: string;
  concept: string;
  amount: string;
  currency: ObligationCurrency;
  dueDate: string;
  status: ObligationStatus;
  type: ObligationType;
}

export type MovementSource = "financial" | "livestock" | "stock";

export interface LastMovement {
  id: string;
  source: MovementSource;
  date: string;
  description: string;
  // financial
  direction?: "INCOME" | "EXPENSE";
  amount?: number;
  currency?: string;
  // livestock / stock
  quantity?: number;
  unit?: string;
  totalPrice?: number | null;
}

export interface DashboardData {
  stock: {
    totalNetStock: number;
  };
  livestock: {
    totalHeads: number;
  };
  financial: {
    monthlyIncome: number;
    monthlyExpense: number;
    monthlyResult: number;
  };
  obligations: {
    urgent: ObligationItem[];
    upcoming: ObligationItem[];
  };
  lastMovements: LastMovement[];
}
