"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { useSessionStore } from "@/lib/auth";
import { axiosPublic } from "@/lib/axios";

export default function FacebookCallbackPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { ssoLogin } = useSessionStore();

  useEffect(() => {
    const code = searchParams.get("code");

    const handleFacebookCallback = async () => {
      if (!code) {
        toast({
          title: "Error",
          description: "No code received from Facebook",
          variant: "destructive",
        });
        window.location.href = "/login";
        return;
      }

      try {
        const callbackUrl = `${window.location.origin}/auth/facebook-callback`;

        const res = await axiosPublic.post("/auth/login/sso", {
          code,
          callbackUrl,
          provider: "facebook",
        });

        const token = res.data?.token;
        if (token) {
          await ssoLogin(token); // Save token, login user
          toast({ title: "Success", description: "Logged in with Facebook" });
          // window.location.href = "/"; // Redirect as needed
        } else {
          throw new Error("Token not received");
        }
      } catch (err) {
        console.error("SSO callback error:", err);
        toast({
          title: "Error",
          description: "Login failed",
          variant: "destructive",
        });
        window.location.href = "/login";
      }
    };

    handleFacebookCallback();
  }, [searchParams, toast, ssoLogin]);

  return <p className="p-4">Logging you in with Facebook...</p>;
}
