import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* Spacer for mobile sidebar width */}
      <div className="md:hidden w-0" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-neutral-100 md:ml-0">
        {children}
      </div>
    </div>
  );
}
