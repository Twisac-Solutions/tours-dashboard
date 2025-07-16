"use client";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { usePathname } from "next/navigation";
import DashboardLayout from "./dashboard-layout";

interface LayoutProviderProps {
  children: React.ReactNode;
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  const pathname = usePathname();
  const isAuthPage =
    pathname.startsWith("/verify-email") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/welcome") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/new-password") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/forbidden") ||
    pathname.startsWith("/not-found") ||
    pathname.startsWith("/forgot-password");
  return (
    <div className="relative flex min-h-screen flex-col">
      {!isAuthPage && <DashboardLayout>{children}</DashboardLayout>}
      {isAuthPage && <div className="flex-1">{children}</div>}
      <Toaster />
      <SonnerToaster />
    </div>
  );
}
