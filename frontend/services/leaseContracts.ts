import { cookies } from "next/headers";
import type { LeaseContract } from "@/types";

const BACKEND_URL = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

async function fetchWithAuth(path: string) {
  const token = cookies().get("atp_token")?.value;
  return fetch(`${BACKEND_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });
}

export async function getLeaseContracts(fieldId?: string): Promise<LeaseContract[]> {
  const url = fieldId
    ? `/lease-contracts?fieldId=${encodeURIComponent(fieldId)}`
    : "/lease-contracts";
  const res = await fetchWithAuth(url);
  if (!res.ok) throw new Error(`LeaseContracts: ${res.status} ${res.statusText}`);
  return res.json() as Promise<LeaseContract[]>;
}

export async function getLeaseContractSummary(fieldId: string): Promise<LeaseContract[]> {
  const res = await fetchWithAuth(`/lease-contracts/${fieldId}/summary`);
  if (!res.ok) throw new Error(`LeaseSummary: ${res.status} ${res.statusText}`);
  return res.json() as Promise<LeaseContract[]>;
}
