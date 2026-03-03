import { cookies } from "next/headers";
import type { ThirdPartyWork } from "@/types";

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

export async function getThirdPartyWorks(providerType?: string): Promise<ThirdPartyWork[]> {
  const url = providerType
    ? `/third-party-works?providerType=${encodeURIComponent(providerType)}`
    : "/third-party-works";
  const res = await fetchWithAuth(url);
  if (!res.ok) throw new Error(`ThirdPartyWorks: ${res.status} ${res.statusText}`);
  return res.json() as Promise<ThirdPartyWork[]>;
}
