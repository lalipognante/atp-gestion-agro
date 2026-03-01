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
  lotId?: string;
  campaignId?: string;
  pricePerUnit?: number;
  date?: string;
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

// ─── Hacienda ─────────────────────────────────────────────
export interface HaciendaDashboard {
  totalHeads: number;
  byCategory: Record<string, number>;
  totalCattleSaleIncome: number;
}

export type LivestockMovementType = "INCOME" | "SALE" | "DEATH" | "TRANSFER" | "ADJUSTMENT";
export type LivestockCategory = "TERNEROS" | "NOVILLOS" | "VACAS" | "TOROS";

export interface CreateHaciendaMovementRequest {
  date: string;
  category: LivestockCategory;
  type: LivestockMovementType;
  quantity: number;
  totalPrice?: number;
  notes?: string;
}

// ─── Stock (server-side full record) ──────────────────────
export interface StockMovementRecord {
  id: string;
  product: string;
  movementType: string;
  quantity: string;
  unit: string;
  lotId: string | null;
  campaignId: string | null;
  createdAt: string;
  campaign?: {
    id: string;
    year: number;
    crop: string;
    lot?: {
      id: string;
      surfaceHa: string;
      location: string | null;
      field?: {
        id: string;
        name: string;
        type: string;
      };
    } | null;
  } | null;
}

// ─── Financial (server-side full record) ──────────────────
export interface FinancialMovementRecord {
  id: string;
  direction: "INCOME" | "EXPENSE";
  category: string | null;
  amount: string;
  currency: "ARS" | "USD";
  exchangeRateAtCreation: string;
  baseCurrencyAmount: string;
  stockMovementId: string | null;
  campaignId: string | null;
  createdAt: string;
}

export interface CreateFinancialMovementRequest {
  direction: "INCOME" | "EXPENSE";
  category?: string;
  amount: number;
  currency: "ARS" | "USD";
  campaignId?: string;
  stockMovementId?: string;
  date?: string;
}

// ─── Fields & Lots ────────────────────────────────────────
export interface Field {
  id: string;
  name: string;
  type: "PROPIO" | "ALQUILADO";
  createdAt: string;
}

export interface Lot {
  id: string;
  fieldId: string;
  surfaceHa: string;
  location: string | null;
  createdAt: string;
  field?: Field;
}

export interface CreateFieldRequest {
  name: string;
  type: "PROPIO" | "ALQUILADO";
}

export interface CreateLotRequest {
  fieldId: string;
  surfaceHa: number;
  location?: string;
}

// ─── Campaigns ────────────────────────────────────────────
export interface Campaign {
  id: string;
  lotId: string;
  year: number;
  crop: string;
  createdAt: string;
}

// ─── Obligations ──────────────────────────────────────────
export interface CreateObligationRequest {
  concept: string;
  amount: number;
  dueDate: string;
  type: ObligationType;
}

// ─── Current User ─────────────────────────────────────────
export interface CurrentUser {
  userId: string;
  role: "ADMIN" | "VIEWER";
}

// ─── Dashboard Yield ──────────────────────────────────────
export interface YieldItem {
  crop: string;
  year: number;
  realTnHa: number;
  targetTnHa: number;
}
