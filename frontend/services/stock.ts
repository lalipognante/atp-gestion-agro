import { api } from "./api";
import type { CreateStockMovementRequest, StockMovementResponse } from "@/types";

export async function createStockMovement(
  data: CreateStockMovementRequest
): Promise<StockMovementResponse> {
  return api.post<StockMovementResponse>("/stock", data);
}
