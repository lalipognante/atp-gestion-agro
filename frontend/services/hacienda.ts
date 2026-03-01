import { cookies } from "next/headers";
import type { HaciendaDashboard } from "@/types";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3000";

export async function getHaciendaDashboard(): Promise<HaciendaDashboard> {
  const token = cookies().get("atp_token")?.value;

  const res = await fetch(`${BACKEND_URL}/hacienda/dashboard`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Hacienda: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<HaciendaDashboard>;
}
