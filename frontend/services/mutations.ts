import { api } from "./api";
import type {
  Field,
  Lot,
  StockMovementResponse,
  FinancialMovementRecord,
  ObligationItem,
  CreateFieldRequest,
  CreateLotRequest,
  CreateStockMovementRequest,
  CreateHaciendaMovementRequest,
  CreateFinancialMovementRequest,
  CreateObligationRequest,
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

export function payObligation(id: string) {
  return api.patch<ObligationItem>(`/obligations/${id}/pay`, {});
}
