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

const ResetPasswordPage = () => {
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
        <div className="w-full max-w-md">
          <div className="mb-12">
            <Logo />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 font-mauline">
            Password Reset
          </h2>
          <p className="text-muted-foreground text-base lg:text-lg mb-8">
            We sent a code to{" "}
            <strong className="text-foreground">example@email.com</strong>
          </p>

          <form onSubmit={handleSubmit} className="space-y-8 mb-8">
            <div>
              <div className="relative lg:mx-4 mx-0">
                <InputOTP
                  maxLength={4}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                >
                  <InputOTPGroup className="w-full">
                    <InputOTPSlot index={0} className="w-full" />
                    <InputOTPSlot index={1} className="w-full" />
                    <InputOTPSlot index={2} className="w-full" />
                    <InputOTPSlot index={3} className="w-full" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
            {/* <div className="text-center text-red-500 text-sm">
              {otp === "" && <>Enter your one-time password.</>}
            </div> */}
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
            <div className="text-center text-muted-foreground">
              Didn’t receive an email?
              <Button
                type="button"
                className="text-yellow-600 text-base px-2"
                variant="link"
              >
                Resend code
              </Button>
            </div>
          </form>

          <div className="text-center">
            <Link
              href="/forgot-password"
              className="inline-flex items-center justify-center hover:text-primary"
            >
              <ArrowLeft className="mr-3 h-6 w-6" /> Back to log in
            </Link>
          </div>
        </div>
      </div>
      {/* Right Side */}
      <OnboardImage imageSrc="/assets/sliding-mobile.png" />
    </div>
  );
};

export default ResetPasswordPage;
