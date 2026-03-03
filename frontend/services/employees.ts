import { cookies } from "next/headers";
import type { Employee, SalaryPayment, SalaryAdvance } from "@/types";

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

export async function getEmployees(): Promise<Employee[]> {
  const res = await fetchWithAuth("/employees");
  if (!res.ok) throw new Error(`Employees: ${res.status} ${res.statusText}`);
  return res.json() as Promise<Employee[]>;
}

export async function getSalaryPayments(): Promise<SalaryPayment[]> {
  const res = await fetchWithAuth("/payroll/payments");
  if (!res.ok) throw new Error(`Salary payments: ${res.status} ${res.statusText}`);
  return res.json() as Promise<SalaryPayment[]>;
}

export async function getSalaryAdvances(): Promise<SalaryAdvance[]> {
  const res = await fetchWithAuth("/payroll/advances");
  if (!res.ok) throw new Error(`Salary advances: ${res.status} ${res.statusText}`);
  return res.json() as Promise<SalaryAdvance[]>;
}
