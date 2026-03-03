import { cookies } from "next/headers";
import type { DashboardData, YieldItem } from "@/types";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3000";

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

export async function getDashboardData(): Promise<DashboardData> {
  const res = await fetchWithAuth("/dashboard");
  if (!res.ok) throw new Error(`Dashboard: ${res.status} ${res.statusText}`);
  return res.json() as Promise<DashboardData>;
}

export async function getYieldData(): Promise<YieldItem[]> {
  const res = await fetchWithAuth("/dashboard/yield");
  if (!res.ok) throw new Error(`Yield: ${res.status} ${res.statusText}`);
  return res.json() as Promise<YieldItem[]>;
}
