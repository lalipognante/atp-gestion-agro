import { cookies } from "next/headers";
import type { ObligationItem } from "@/types";

const BACKEND_URL = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export async function getObligations(): Promise<ObligationItem[]> {
  const token = cookies().get("atp_token")?.value;

  const res = await fetch(`${BACKEND_URL}/obligations`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Obligations: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<ObligationItem[]>;
}
