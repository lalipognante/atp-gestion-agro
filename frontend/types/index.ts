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
export type PaymentMethod =
  | "CASH"
  | "TRANSFER"
  | "THIRD_PARTY_CHECK"
  | "QUINTALES"
  | "OTHER";

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
  notes?: string;
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

export type MovementSource = "financial" | "livestock" | "stock" | "thirdPartyWork";

export interface LastMovement {
  id: string;
  source: MovementSource;
  date: string;
  description: string;
  direction?: "INCOME" | "EXPENSE";
  amount?: number;
  currency?: string;
  quantity?: number;
  unit?: string;
  totalPrice?: number | null;
  contractor?: string;
  lotLabel?: string;
}

// ─── Sanidad ──────────────────────────────────────────────
export type LivestockType = "VACA" | "FEEDLOT" | "TERNERO";
export type TreatmentType = "VACUNA" | "BAÑO" | "DESPARASITACION" | "OTRO";

export interface HealthRecord {
  id: string;
  date: string;
  livestockType: LivestockType;
  treatmentType: TreatmentType;
  quantity: number;
  appliesToAll: boolean;
  totalCost: string | null;
  costPerHead: string | null;
  cost: string | null;
  notes: string | null;
  createdAt: string;
  deletedAt: string | null;
}

export interface CreateHealthRecordRequest {
  date: string;
  livestockType: LivestockType;
  treatmentType: TreatmentType;
  quantity: number;
  appliesToAll?: boolean;
  totalCost?: number;
  costPerHead?: number;
  cost?: number;
  notes?: string;
}

export interface DashboardData {
  stock: {
    totalNetStock: number;
  };
  livestock: {
    totalHeads: number;
    byCategory: Record<string, number>;
  };
  financial: {
    monthlyIncome: number;
    monthlyExpense: number;
    monthlyResult: number;
  };
  obligations: {
    urgent: ObligationItem[];
    upcoming: ObligationItem[];
    pendingCount: number;
  };
  lastMovements: LastMovement[];
  paymentByMethod: Record<string, number>;
  latestHealthRecords: HealthRecord[];
  recentThirdPartyWorks: ThirdPartyWork[];
}

// ─── Third Party Works ────────────────────────────────────
export type ThirdPartyWorkType =
  | "SIEMBRA"
  | "FUMIGACION"
  | "COSECHA"
  | "FERTILIZACION"
  | "MOVIMIENTO_SUELO";

export type ProviderType = "INTERNO" | "EXTERNO";
export type ThirdPartyWorkStatus = "PENDING" | "PAID" | "CANCELLED";

export interface ThirdPartyWork {
  id: string;
  date: string;
  workType: ThirdPartyWorkType;
  lotId: string;
  contractor: string;
  paymentMethod: PaymentMethod;
  amount: string | null;
  currency: Currency | null;
  quintales: string | null;
  grainType: string | null;
  reference: string | null;
  notes: string | null;
  providerType: ProviderType;
  status: ThirdPartyWorkStatus;
  financialMovementId: string | null;
  createdAt: string;
  deletedAt: string | null;
  lot?: {
    id: string;
    location: string | null;
    field?: { id: string; name: string; type: string } | null;
  };
}

export interface CreateThirdPartyWorkRequest {
  date: string;
  workType: ThirdPartyWorkType;
  lotId: string;
  contractor: string;
  paymentMethod: PaymentMethod;
  amount?: number;
  currency?: Currency;
  quintales?: number;
  grainType?: string;
  reference?: string;
  notes?: string;
  providerType?: ProviderType;
  status?: ThirdPartyWorkStatus;
}

// ─── Hacienda ─────────────────────────────────────────────
export interface HaciendaDashboard {
  totalHeads: number;
  byCategory: Record<string, number>;
  totalCattleSaleIncome: number;
}

export type LivestockMovementType = "INCOME" | "SALE" | "DEATH" | "TRANSFER" | "ADJUSTMENT";
export type LivestockCategory = "TERNEROS" | "NOVILLOS" | "VACAS" | "TOROS";
export type LivestockCategoryV2 = "TERNERO" | "TERNERA" | "NOVILLO" | "VAQUILLONA" | "TORO" | "VACA";

export interface CreateHaciendaMovementRequest {
  date: string;
  categoryV2: LivestockCategoryV2;
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
  unitPrice: string | null;
  notes: string | null;
  lotId: string | null;
  campaignId: string | null;
  createdAt: string;
  deletedAt: string | null;
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

export interface StockNetProduct {
  product: string;
  net: number;
  unit: string;
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
  paymentMethod: PaymentMethod | null;
  reference: string | null;
  counterparty: string | null;
  notes: string | null;
  stockMovementId: string | null;
  campaignId: string | null;
  createdAt: string;
  deletedAt: string | null;
}

export interface CreateFinancialMovementRequest {
  direction: "INCOME" | "EXPENSE";
  category?: string;
  amount: number;
  currency: "ARS" | "USD";
  paymentMethod?: PaymentMethod;
  reference?: string;
  counterparty?: string;
  notes?: string;
  campaignId?: string;
  stockMovementId?: string;
  date: string;
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

// ─── Employees / Payroll ──────────────────────────────────
export interface Employee {
  id: string;
  name: string;
  createdAt: string;
}

export interface SalaryPayment {
  id: string;
  employeeId: string;
  date: string;
  amount: string;
  notes: string | null;
  financialMovementId: string | null;
  createdAt: string;
  deletedAt: string | null;
  employee?: Employee;
}

export interface SalaryAdvance {
  id: string;
  employeeId: string;
  date: string;
  amount: string;
  notes: string | null;
  financialMovementId: string | null;
  createdAt: string;
  deletedAt: string | null;
  employee?: Employee;
}

export interface CreateEmployeeRequest {
  name: string;
}

export interface CreateSalaryPaymentRequest {
  employeeId: string;
  date: string;
  amount: number;
  notes?: string;
}

export interface CreateSalaryAdvanceRequest {
  employeeId: string;
  date: string;
  amount: number;
  notes?: string;
}

// ─── Dashboard Yield ──────────────────────────────────────
export interface YieldItem {
  crop: string;
  year: number;
  realTnHa: number;
  targetTnHa: number;
}

// ─── Lease Contracts ──────────────────────────────────────
export interface LeaseDelivery {
  id: string;
  contractId: string;
  date: string;
  quintales: string;
  amountARS: string;
  paymentMethod: PaymentMethod;
  reference: string | null;
  notes: string | null;
  financialMovementId: string | null;
  createdAt: string;
  deletedAt: string | null;
}

export interface LeaseContract {
  id: string;
  fieldId: string;
  year: number;
  totalQuintales: string;
  notes: string | null;
  createdAt: string;
  deletedAt: string | null;
  field?: Field;
  deliveries: LeaseDelivery[];
  deliveredQuintales?: number;
  remainingQuintales?: number;
}

export interface CreateLeaseContractRequest {
  fieldId: string;
  year: number;
  totalQuintales: number;
  notes?: string;
}

export interface CreateLeaseDeliveryRequest {
  contractId: string;
  date: string;
  quintales: number;
  amountARS: number;
  paymentMethod: PaymentMethod;
  reference?: string;
  notes?: string;
}
