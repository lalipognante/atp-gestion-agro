"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { login } from "@/services/auth";
import { getToken } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (getToken()) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Completá todos los campos.");
      return;
    }

    try {
      setLoading(true);
      await login({ email: email.trim(), password });
      router.replace("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError("Credenciales incorrectas. Verificá tu email y contraseña.");
      } else {
        setError("Error inesperado. Intentá nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-green-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background radial gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(61,138,95,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139,111,71,0.08) 0%, transparent 50%)",
        }}
      />

      <div
        className="relative z-10 w-full max-w-sm bg-white/4 border border-white/10 backdrop-blur-md rounded-2xl px-10 py-12 shadow-2xl"
        style={{ animation: "fadeUp 0.5s ease both" }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-9">
          <Logo variant="light" size="lg" />
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-normal text-white">
            Bienvenido
          </h1>
          <p className="text-sm text-white/40 mt-1.5">
            Ingresá para acceder a tu gestión
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Correo electrónico"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="productor@campo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="dark"
          />
          <Input
            label="Contraseña"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="dark"
          />

          {error && (
            <p className="text-xs text-red-300 bg-red-900/30 border border-red-500/20 rounded-lg px-3 py-2.5">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" loading={loading} className="mt-2">
            Ingresar
          </Button>
        </form>

        <p className="text-center text-xs text-white/20 mt-8">
          © {new Date().getFullYear()} ATP Gestión Agro — Uso interno
        </p>
      </div>

      <style jsx global>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </main>
  );
}
