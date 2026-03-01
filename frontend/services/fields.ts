import { cookies } from "next/headers";
import type { Field, Lot } from "@/types";

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

export async function getFields(): Promise<Field[]> {
  const res = await fetchWithAuth("/fields");
  if (!res.ok) throw new Error(`Fields: ${res.status} ${res.statusText}`);
  return res.json() as Promise<Field[]>;
}

export async function getLots(): Promise<Lot[]> {
  const res = await fetchWithAuth("/lots");
  if (!res.ok) throw new Error(`Lots: ${res.status} ${res.statusText}`);
  return res.json() as Promise<Lot[]>;
}
