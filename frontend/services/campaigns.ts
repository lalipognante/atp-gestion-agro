import { cookies } from "next/headers";
import type { Campaign } from "@/types";

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

export async function getCampaigns(): Promise<Campaign[]> {
  const res = await fetchWithAuth("/campaigns");
  if (!res.ok) throw new Error(`Campaigns: ${res.status} ${res.statusText}`);
  return res.json() as Promise<Campaign[]>;
}
