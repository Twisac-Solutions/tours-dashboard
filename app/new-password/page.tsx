"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { axiosPublic } from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/custom/password-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Logo from "@/components/logo";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { OnboardImage } from "@/components/onboard-image";
import Link from "next/link";
import { Icons } from "@/components/ui/icons";

const NewPasswordPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Error",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      });
      return;
    }
    setIsVerifying(true);
    try {
      const response = await axiosPublic.post("/auth/reset-password", {
        email: email,
        password: newPassword,
        otp: otp,
      });
      if (response.status === 201) {
        toast({
          title: "Success",
          description: "Your password has been updated successfully.",
        });
        router.push("/login");
      } else {
        toast({
          variant: "destructive",

          title: "Verification Failed",

          description: response.data.message || "Error Resetting Password",
        });
      }
    } catch (error) {
      setError("Error Resetting Password");
      toast({
        variant: "destructive",

        title: "OTP Verification Failed",

        description: "Error Resetting Password Check OTP Code",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-h-[100vh] h-dvh flex lg:p-8 p-0">
      {/* Left Side*/}
      <div className="flex-1 flex lg:items-center justify-center lg:p-8 p-4">
        <div className="w-full max-w-xl">
          <div className="mb-8">
            <Logo />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 font-mauline">
            Set a New Password
          </h2>
          <p className="text-muted-foreground text-base lg:text-lg mb-8">
            Must be at least 8 characters
          </p>

          <form onSubmit={handleSubmit} className="space-y-8 mb-8">
            <div>
              <Label className="block text-sm font-semibold mb-3">
                New Password
              </Label>
              <div className="relative">
                <PasswordInput
                  value={newPassword}
                  required
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="w-full p-6 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent pl-4 border-[#e5e5e5]"
                />
              </div>
            </div>
            <div>
              <Label className="block text-sm font-semibold mb-3">
                Confirm Password
              </Label>
              <div className="relative">
                <PasswordInput
                  value={confirmNewPassword}
                  required
                  onChange={(event) =>
                    setConfirmNewPassword(event.target.value)
                  }
                  className="w-full p-6 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent pl-4 border-[#e5e5e5]"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-md p-6"
              disabled={isVerifying}
            >
              {isVerifying ? (
                <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>

          <div className="text-center">
            <Link
              href="/reset-password"
              className="inline-flex items-center justify-center hover:text-primary"
            >
              <ArrowLeft className="mr-3 h-6 w-6" /> Back to log in
            </Link>
          </div>
        </div>
      </div>
      {/* Right Side */}
      <OnboardImage imageSrc="/assets/3.jpg" />
    </div>
  );
};

export default NewPasswordPage;
