import { cookies } from "next/headers";
import type { ThirdPartyWork } from "@/types";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3000";

export async function getThirdPartyWorks(lotId?: string): Promise<ThirdPartyWork[]> {
  const token = cookies().get("atp_token")?.value;
  const url = lotId
    ? `${BACKEND_URL}/third-party-works?lotId=${lotId}`
    : `${BACKEND_URL}/third-party-works`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`ThirdPartyWorks: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<ThirdPartyWork[]>;
}
