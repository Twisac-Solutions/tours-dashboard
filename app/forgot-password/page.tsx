"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/hooks/use-toast";
import { axiosPublic } from "@/lib/axios";
import Logo from "@/components/logo";
import { ArrowLeft, Mail } from "lucide-react";
import { OnboardImage } from "@/components/onboard-image";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosPublic.post("/auth/forgot-password", {
        email: email,
      });

      toast({
        title: "Reset OTP sent",
        description:
          response.data.data.message ||
          "If an account exists for this email, you will receive a otp code to reset your password.",
      });
      router.push("/reset-password");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-h-[100vh]  h-dvh flex lg:p-8 p-0">
      {/* Left Side*/}
      <div className="flex-1 flex lg:items-center justify-center lg:p-8 p-4">
        <div className="w-full max-w-xl">
          <div className="mb-8">
            <Logo />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 font-mauline">
            Forgot your password?
          </h2>
          <p className="text-muted-foreground text-sm lg:text-lg mb-8">
            No worries! Just enter your email address below and we’ll send you a
            link to reset your password
          </p>

          <form onSubmit={onSubmit} className="space-y-6 mb-8">
            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-semibold mb-3"
              >
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-6 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent  pl-4   border-[#e5e5e5]"
                />
                {/* <Mail className="absolute left-3 top-2.5 h-5 w-5" /> */}
              </div>
            </div>
            <Button
              type="submit"
              className="w-full rounded-md p-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>

          <div className="text-center">
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center hover:text-primary"
            >
              <ArrowLeft className="mr-3 h-6 w-6" /> Back to Log in
            </Link>
          </div>
        </div>
      </div>
      {/* Right Side */}
      <OnboardImage imageSrc="/assets/2.jpg" />
    </div>
  );
}
