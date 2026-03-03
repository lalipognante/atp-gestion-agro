import { cookies } from "next/headers";
import type { FinancialMovementRecord } from "@/types";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3000";

export async function getFinancialMovements(): Promise<FinancialMovementRecord[]> {
  const token = cookies().get("atp_token")?.value;

  const res = await fetch(`${BACKEND_URL}/financial`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Financial: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<FinancialMovementRecord[]>;
}
