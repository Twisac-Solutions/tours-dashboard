"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Facebook, Lock, Mail, User2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/custom/password-input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { axiosPublic } from "@/lib/axios";
import { Icons } from "@/components/ui/icons";
import Image from "next/image";
import { PhoneInput } from "@/components/custom/phone-input";
import Logo from "@/components/logo";
import GoogleLoginButton from "@/components/google-button";
import FacebookLoginButton from "@/components/facebook-button";
import { OnboardImage } from "@/components/onboard-image";

export default function SignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 8 || password.length > 100) {
      return "Password must be between 8 and 100 characters.";
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }

    // Check for at least one digit
    if (!/\d/.test(password)) {
      return "Password must contain at least one digit.";
    }

    // Check for at least one special character
    if (!/[@$!%*?&#^]/.test(password)) {
      return "Password must contain at least one special character (@$!%*?&#^).";
    }

    return null; // No errors
  };

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        toast({
          title: "Password Error",
          description: passwordError,
          variant: "destructive",
        });
        throw new Error(passwordError);
      }

      if (formData.password !== formData.confirm_password) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        throw new Error("Passwords do not match");
      }
      const response = await axiosPublic.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201) {
        router.push("/login");
      } else {
        setError("An error occurred during sign up");
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
      }
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
    <div className="max-h-[100vh]  h-dvh flex p-8">
      {/* Left Side - Sign In Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Logo />
          </div>

          <h2 className="text-4xl lg:text-5xl  font-bold mb-3 font-mauline">
            Sign Up For Free.
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Let&apos;s sign up quickly to get started.
          </p>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <Label
                htmlFor="name"
                className="block text-sm font-semibold mb-3"
              >
                Name
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full  border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent  pl-10 pr-12 border-border"
                  placeholder="Enter your name"
                />
                <User2 className="absolute left-3 top-2.5 h-5 w-5" />
              </div>
            </div>
            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-semibold mb-3"
              >
                Email Address
              </Label>
              <div className="relative">
                <Input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full  border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent  pl-10 pr-12 border-border"
                  placeholder="Enter your email"
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5" />
              </div>
            </div>

            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-semibold mb-3"
              >
                Password
              </Label>
              <div className="relative">
                <PasswordInput
                  id="password"
                  name="password"
                  autoComplete="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full  border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent  pl-10 pr-12 border-border"
                  placeholder="Enter your password"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5" />
              </div>
            </div>

            <div>
              <Label
                htmlFor="confirm_password"
                className="block text-sm font-semibold mb-3"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <PasswordInput
                  id="confirm_password"
                  name="confirm_password"
                  required
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  className="w-full  border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent  pl-10 pr-12 border-border"
                  placeholder="Confirm your password"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5" />
              </div>
            </div>
            <div className="py-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full text-white p-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Sign Up"
                )}
              </Button>
            </div>
            <div className="text-center">
              <span className="text-muted-foreground text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-primary">
                  Log in
                </Link>
              </span>
            </div>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background  text-muted-foreground">
                  OR
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4 py-4">
              <GoogleLoginButton />
              <FacebookLoginButton />
            </div>
          </form>
        </div>
      </div>
      <OnboardImage imageSrc="/assets/Mobile Mock-Up Slide.png" />
    </div>
  );
}
