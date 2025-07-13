"use client";

import { Button } from "@/components/ui/button";
import { axiosPublic } from "@/lib/axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import GoogleIcon from "./icons/GoogleIcon";

export default function GoogleLoginButton() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      const callbackUrl = `${window.location.origin}/auth/callback`;
      const res = await axiosPublic.get(`/auth/google`, {
        params: { callback: callbackUrl },
      });
      const googleUrl = res.data;
      if (googleUrl) {
        window.location.href = googleUrl;
      } else {
        throw new Error("No URL returned");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setLoading(false);
    }
  };
  return (
    <Button
      variant="outline"
      onClick={handleGoogleLogin}
      disabled={loading}
      className="rounded-full"
    >
      {loading ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : null}
      <GoogleIcon className="lucide mr-2 h-4 w-4" /> Continue With Google
    </Button>
  );
}
