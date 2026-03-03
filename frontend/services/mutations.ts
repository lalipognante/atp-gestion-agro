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
  ThirdPartyWork,
  LeaseContract,
  LeaseDelivery,
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
  CreateThirdPartyWorkRequest,
  CreateLeaseContractRequest,
  CreateLeaseDeliveryRequest,
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

export function voidStockMovement(id: string) {
  return api.patch<StockMovementResponse>(`/stock/${id}/void`, {});
}

// ─── Hacienda ─────────────────────────────────────────────
export function createHaciendaMovement(data: CreateHaciendaMovementRequest) {
  return api.post<{ id: string }>("/hacienda/movements", data);
}

export function voidHaciendaMovement(id: string) {
  return api.patch<{ id: string }>(`/hacienda/movements/${id}/void`, {});
}

// ─── Financial ────────────────────────────────────────────
export function createFinancialMovement(data: CreateFinancialMovementRequest) {
  return api.post<FinancialMovementRecord>("/financial", data);
}

export function voidFinancialMovement(id: string) {
  return api.patch<FinancialMovementRecord>(`/financial/${id}/void`, {});
}

// ─── Obligations ──────────────────────────────────────────
export function createObligation(data: CreateObligationRequest) {
  return api.post<ObligationItem>("/obligations", data);
}

export function payObligation(id: string, date: string) {
  return api.patch<ObligationItem>(`/obligations/${id}/pay`, { date });
}

export function voidObligation(id: string) {
  return api.patch<ObligationItem>(`/obligations/${id}/void`, {});
}

// ─── Health ───────────────────────────────────────────────
export function createHealthRecord(data: CreateHealthRecordRequest) {
  return api.post<HealthRecord>("/hacienda/health", data);
}

export function voidHealthRecord(id: string) {
  return api.patch<HealthRecord>(`/hacienda/health/${id}/void`, {});
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

// ─── Third Party Works ────────────────────────────────────
export function createThirdPartyWork(data: CreateThirdPartyWorkRequest) {
  return api.post<ThirdPartyWork>("/third-party-works", data);
}

export function markThirdPartyWorkPaid(id: string) {
  return api.patch<ThirdPartyWork>(`/third-party-works/${id}/pay`, {});
}

export function voidThirdPartyWork(id: string) {
  return api.patch<ThirdPartyWork>(`/third-party-works/${id}/void`, {});
}

// ─── Lease Contracts ──────────────────────────────────────
export function createLeaseContract(data: CreateLeaseContractRequest) {
  return api.post<LeaseContract>("/lease-contracts", data);
}

export function voidLeaseContract(id: string) {
  return api.patch<LeaseContract>(`/lease-contracts/${id}/void`, {});
}

export function createLeaseDelivery(data: CreateLeaseDeliveryRequest) {
  return api.post<LeaseDelivery>("/lease-contracts/deliveries", data);
}

export function voidLeaseDelivery(id: string) {
  return api.patch<LeaseDelivery>(`/lease-contracts/deliveries/${id}/void`, {});
}
