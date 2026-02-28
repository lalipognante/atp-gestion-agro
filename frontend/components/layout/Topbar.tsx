"use client";

import { Logo } from "@/components/ui/Logo";
import { logout } from "@/services/auth";
import { useRouter } from "next/navigation";

export function Topbar() {
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-14 px-6">
        <div className="flex items-center gap-6">
          <Logo />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-green-700 flex items-center justify-center text-white text-xs font-semibold">
              A
            </div>
            <span className="text-sm text-gray-700 font-medium">Mi cuenta</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded-md px-2.5 py-1.5 transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
