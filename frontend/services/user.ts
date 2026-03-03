import { cookies } from "next/headers";
import type { CurrentUser } from "@/types";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3000";

export async function getCurrentUser(): Promise<CurrentUser> {
  const token = cookies().get("atp_token")?.value;

  const res = await fetch(`${BACKEND_URL}/auth/me`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Auth: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<CurrentUser>;
}
