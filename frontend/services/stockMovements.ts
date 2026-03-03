import { cookies } from "next/headers";
import type { StockMovementRecord } from "@/types";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3000";

export async function getStockMovements(): Promise<StockMovementRecord[]> {
  const token = cookies().get("atp_token")?.value;

  const res = await fetch(`${BACKEND_URL}/stock`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Stock: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<StockMovementRecord[]>;
}
