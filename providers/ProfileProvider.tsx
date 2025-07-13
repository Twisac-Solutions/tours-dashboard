"use client";

import { ReactNode, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { axiosPrivate } from "@/lib/axios";
import { useProfileStore } from "@/store/useProfileStore";

export default function ProfileProvider({ children }: { children: ReactNode }) {
  const { profile, setProfile } = useProfileStore();
  const { toast } = useToast();

  useEffect(() => {
    if (!profile) {
      axiosPrivate
        .get("/user/me")
        .then((res) => {
          setProfile(res.data.user);
        })
        .catch((err) => {
          console.error("Failed to load profile", err);
          toast({
            title: "Error loading profile",
            description: "Please try again later.",
            variant: "destructive",
          });
        });
    }
  }, [profile, setProfile, toast]);

  return <>{children}</>;
}
