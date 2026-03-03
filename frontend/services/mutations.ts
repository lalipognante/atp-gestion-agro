import { api } from "./api";
import type {
  Field,
  Lot,
  StockMovementResponse,
  FinancialMovementRecord,
  ObligationItem,
  HealthRecord,
  Employee,
  SalaryPayment,
  SalaryAdvance,
  CreateFieldRequest,
  CreateLotRequest,
  CreateStockMovementRequest,
  CreateHaciendaMovementRequest,
  CreateFinancialMovementRequest,
  CreateObligationRequest,
  CreateHealthRecordRequest,
  CreateEmployeeRequest,
  CreateSalaryPaymentRequest,
  CreateSalaryAdvanceRequest,
} from "@/types";

// ─── Fields ───────────────────────────────────────────────
export function createField(data: CreateFieldRequest) {
  return api.post<Field>("/fields", data);
}

export function updateField(id: string, data: Partial<CreateFieldRequest>) {
  return api.patch<Field>(`/fields/${id}`, data);
}

// ─── Lots ─────────────────────────────────────────────────
export function createLot(data: CreateLotRequest) {
  return api.post<Lot>("/lots", data);
}

export function updateLot(id: string, data: Partial<CreateLotRequest>) {
  return api.patch<Lot>(`/lots/${id}`, data);
}

// ─── Stock ────────────────────────────────────────────────
export function createStockMovement(data: CreateStockMovementRequest) {
  return api.post<StockMovementResponse>("/stock", data);
}

// ─── Hacienda ─────────────────────────────────────────────
export function createHaciendaMovement(data: CreateHaciendaMovementRequest) {
  return api.post<{ id: string }>("/hacienda/movements", data);
}

// ─── Financial ────────────────────────────────────────────
export function createFinancialMovement(data: CreateFinancialMovementRequest) {
  return api.post<FinancialMovementRecord>("/financial", data);
}

// ─── Obligations ──────────────────────────────────────────
export function createObligation(data: CreateObligationRequest) {
  return api.post<ObligationItem>("/obligations", data);
}

export function payObligation(id: string, date: string) {
  return api.patch<ObligationItem>(`/obligations/${id}/pay`, { date });
}

// ─── Health ───────────────────────────────────────────────
export function createHealthRecord(data: CreateHealthRecordRequest) {
  return api.post<HealthRecord>("/hacienda/health", data);
}

// ─── Employees ────────────────────────────────────────────
export function createEmployee(data: CreateEmployeeRequest) {
  return api.post<Employee>("/employees", data);
}

// ─── Payroll ──────────────────────────────────────────────
export function createSalaryPayment(data: CreateSalaryPaymentRequest) {
  return api.post<SalaryPayment>("/payroll/payments", data);
}

export function createSalaryAdvance(data: CreateSalaryAdvanceRequest) {
  return api.post<SalaryAdvance>("/payroll/advances", data);
}
