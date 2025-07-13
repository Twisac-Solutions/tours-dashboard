"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { startSSOLogin } from "@/lib/sso"; // Import helper
import FacebookIcon from "./icons/FacebookIcon";

export default function FacebookLoginButton() {
  const [loading, setLoading] = useState(false);

  const handleFacebookLogin = async () => {
    setLoading(true);
    try {
      const callbackUrl = `${window.location.origin}/auth/facebook-callback`;
      await startSSOLogin("facebook", callbackUrl);
    } catch (error) {
      console.error("Facebook login error:", error);
      toast({ title: "Facebook login failed", variant: "destructive" });
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleFacebookLogin}
      disabled={loading}
      className="rounded-full"
    >
      {loading && <Loader2 className="animate-spin mr-2 w-4 h-4" />}
      <FacebookIcon className="mr-2 h-4 w-4" />
      Continue With Facebook
    </Button>
  );
}
