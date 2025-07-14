"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Facebook, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/custom/password-input";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/ui/icons";
import { useSessionStore } from "@/lib/auth";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Logo from "@/components/logo";
import GoogleLoginButton from "@/components/google-button";
import FacebookLoginButton from "@/components/facebook-button";
import { OnboardImage } from "@/components/onboard-image";

export default function LogIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { signIn } = useSessionStore();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await signIn(formData.email, formData.password);
      // router.push("/");
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
      {/* Left Side - Purple Gradient */}

      <div className="flex-1 flex lg:items-center justify-center lg:p-8 p-4">
        <div className="w-full max-w-xl">
          <div className="mb-8">
            <Logo />
          </div>

          <h2 className="text-4xl lg:text-5xl  font-bold mb-3 font-mauline">
            Welcome back!
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Ready to pick up where you left off?
          </p>

          <form onSubmit={onSubmit} className="space-y-6">
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
                  className="w-full p-6 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent  pl-4 pr-12 border-border "
                  placeholder="example@email.com"
                />
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
                  className="w-full p-6 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent  pl-4 pr-12 border-border "
                  placeholder="*********"
                />

                <div className="text-end py-2">
                  <Link
                    href="/forgot-password"
                    className="text-sm hover:text-primary"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>
            </div>
            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full text-white p-6 rounded-md transition-colors flex items-center justify-center  gap-2"
              >
                {isLoading ? (
                  <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Log In"
                )}
              </Button>
            </div>

            <div className="text-center">
              <span className="text-muted-foreground text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-primary ml-2">
                  Sign Up
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
      {/* Right Side - Sign In Form */}
      <OnboardImage imageSrc="/assets/2.jpg" />
    </div>
  );
}
