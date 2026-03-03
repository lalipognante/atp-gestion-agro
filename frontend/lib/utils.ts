// ─── Token helpers (localStorage) ─────────────────────────
const TOKEN_KEY = "token";
const COOKIE_KEY = "atp_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ─── Cookie helpers (for server component auth) ────────────
export function setAuthCookie(token: string): void {
  document.cookie = `${COOKIE_KEY}=${token}; path=/; SameSite=Lax; max-age=${COOKIE_MAX_AGE}`;
}

export function removeAuthCookie(): void {
  document.cookie = `${COOKIE_KEY}=; path=/; max-age=0`;
}

// ─── Number formatting ─────────────────────────────────────
export function formatCurrency(
  value: number,
  currency: "ARS" | "USD" = "ARS"
): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: 2,
  }).format(value);
}

// ─── Date formatting ───────────────────────────────────────
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

export function formatDateShort(dateString: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(dateString));
}

// ─── Class merging ─────────────────────────────────────────
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
