"use client";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useSessionStore } from "@/lib/auth";
import { Skeleton } from "./ui/skeleton";

export default function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function ProtectedRoute(props: P) {
    const store = useSessionStore.getState();
    const session = store.session;
    const isAuthenticated = store.isAuthenticated;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!isAuthenticated()) {
        redirect("/login");
      } else {
        setLoading(false);
      }
    }, [isAuthenticated, session]);

    if (loading) {
      return (
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin h-16 w-16 border-4 border-accent border-t-primary rounded-full"></div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
