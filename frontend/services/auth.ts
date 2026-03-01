import { api } from "./api";
import { setToken, removeToken, setAuthCookie, removeAuthCookie } from "@/lib/utils";
import type { LoginRequest, LoginResponse } from "@/types";

export async function login(credentials: LoginRequest): Promise<void> {
  const data = await api.post<LoginResponse>("/auth/login", credentials, false);
  setToken(data.access_token);
  setAuthCookie(data.access_token);
}

export function logout(): void {
  removeToken();
  removeAuthCookie();
}
