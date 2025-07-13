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
import { Lock, Mail } from "lucide-react";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

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
    <div className="flex flex-col items-center justify-center p-6 ">
      <div className="flex  items-center  mt-16">
        <Logo />
      </div>
      <Card className="w-full lg:w-[30%] mt-10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Reset Password
          </CardTitle>

          <CardDescription className="text-center">
            Please enter your new password
          </CardDescription>
        </CardHeader>

        <CardContent className="flex justify-center">
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div>
              <Label className="block text-sm font-medium text-muted-foreground mb-2">
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border  rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pl-10"
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5" />
              </div>
            </div>
            <div>
              <Label className="block text-sm font-medium text-muted-foreground mb-2">
                New Password
              </Label>
              <div className="relative">
                <PasswordInput
                  value={newPassword}
                  required
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="w-full px-4 py-2 border  rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pl-10"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5" />
              </div>
            </div>
            <div>
              <Label className="block text-sm font-medium text-muted-foreground mb-2">
                Confirm New Password
              </Label>
              <div className="relative">
                <PasswordInput
                  value={confirmNewPassword}
                  required
                  onChange={(event) =>
                    setConfirmNewPassword(event.target.value)
                  }
                  className="w-full px-4 py-2 border  rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pl-10"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5" />
              </div>
            </div>
            <div>
              <Label className="block text-sm font-medium text-muted-foreground mb-2">
                OTP
              </Label>
              <div className="relative">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                >
                  <InputOTPGroup className="w-full">
                    <InputOTPSlot index={0} className="w-full" />
                    <InputOTPSlot index={1} className="w-full" />
                    <InputOTPSlot index={2} className="w-full" />
                    <InputOTPSlot index={3} className="w-full" />
                    <InputOTPSlot index={4} className="w-full" />
                    <InputOTPSlot index={5} className="w-full" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <div className="text-center text-red-500 text-sm">
                {otp === "" && <>Enter your one-time password.</>}
              </div>
            </div>
            <div className="py-4">
              <Button type="submit" className="w-full" disabled={isVerifying}>
                Reset Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
