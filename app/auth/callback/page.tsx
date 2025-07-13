"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSessionStore } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { ssoLogin } = useSessionStore();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");
      if (token) {
        await ssoLogin(token);
        toast({ title: "Success", description: "Logged in with Google" });
      }
    };

    handleCallback();
  }, [searchParams, ssoLogin]);

  return <p className="p-4">Processing login...</p>;
}
