import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-neutral-100 text-neutral-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-neutral-100">
        {children}
      </div>
    </div>
  );
}
