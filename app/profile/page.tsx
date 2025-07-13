"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useProfileStore } from "@/store/useProfileStore";
import { axiosPrivate } from "@/lib/axios";

// Define types for the API responses
interface ProfileData {
  id: string;
  fullName: string;
  avatar: string;
  phoneNumber: string;
  email: string;
  language: string;
}

interface Language {
  id: string;
  name: string;
  code: string;
}

export default function ProfilePage() {
  const { profile, setProfile } = useProfileStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [languageId, setLanguageId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [languages, setLanguages] = useState<Language[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockLanguages: Language[] = [
    { id: "en", name: "English", code: "en" },
    { id: "es", name: "Spanish", code: "es" },
    { id: "fr", name: "French", code: "fr" },
    { id: "de", name: "German", code: "de" },
    { id: "zh", name: "Chinese", code: "zh" },
    { id: "ja", name: "Japanese", code: "ja" },
    { id: "ar", name: "Arabic", code: "ar" },
    { id: "hi", name: "Hindi", code: "hi" },
    { id: "pt", name: "Portuguese", code: "pt" },
    { id: "ru", name: "Russian", code: "ru" },
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get("/user/me");
      setProfile(res.data.data);
      setLanguageId(res.data.data.languageId);
      setFullName(res.data.data.fullName);
      setPhoneNumber(res.data.data.phoneNumber);
      setLanguages(mockLanguages);
    } catch (err) {
      toast({ title: "Error fetching languages", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setPhoneNumber(formattedNumber);
  };

  const handleUpdateProfile = async () => {
    const phoneError = validatePhoneNumber(phoneNumber);
    if (phoneError) {
      toast({
        title: "Phone Number Error",
        description: phoneError,
        variant: "destructive",
      });
      throw new Error(phoneError);
    }
    if (!fullName) {
      toast({
        title: "Error",
        description: "Full name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await axiosPrivate.post("/user", {
        fullName,
        phoneNumber,
        languageId,
      });

      setProfile(res.data.data);
      fetchProfile();
      toast({ title: "Profile updated successfully!" });
    } catch (error) {
      console.error("Failed to update profile:", error);
      setIsSubmitting(false);

      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (!file)
      return toast({ title: "Please select an image", variant: "destructive" });

    try {
      setIsUploadingAvatar(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await axiosPrivate.patch("/user/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(res.data.data);
      toast({ title: "Avatar updated!" });
      setIsUploadingAvatar(false);
    } catch (err: any) {
      toast({
        title: "Avatar upload failed",
        description: err.response?.data?.message,
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const validatePhoneNumber = (phoneNumber: string): string | null => {
    const phonePattern =
      /^\(?([2-9][0-9]{2})\)?[-.● ]?([2-9][0-9]{2})[-.● ]?([0-9]{4})$/;
    if (!phonePattern.test(phoneNumber)) {
      return "Phone number is not valid. It should match the pattern (XXX) XXX-XXXX.";
    }
    return null;
  };
  const formatPhoneNumber = (phoneNumber: string): string => {
    const cleaned = phoneNumber.replace(/\D/g, "");

    if (cleaned.length >= 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(
        6,
        10
      )}`;
    }

    return cleaned;
  };
  return (
    <div>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your personal information and account preferences
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">
                Loading your profile...
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-8 border rounded-lg">
              <p className="text-primary mb-2">{error}</p>
              <Button
                variant="outline"
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  // Retry fetching
                  setTimeout(() => setLoading(false), 1000);
                }}
              >
                Retry
              </Button>
            </div>
          ) : profile ? (
            <div className="space-y-6">
              {/* Avatar Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>
                    Update your profile picture. This will be displayed across
                    the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                        <Image
                          src={
                            avatarPreview ||
                            profile.avatar ||
                            "/placeholder.svg"
                          }
                          alt="Profile picture"
                          width={128}
                          height={128}
                          priority
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <button
                        className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md hover:bg-primary transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera size={16} />
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleAvatarChange}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-2">Upload a new photo</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Choose a clear photo of yourself. JPG, PNG or GIF,
                        maximum 5MB.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Choose File
                        </Button>
                        {file && (
                          <Button
                            className="bg-primary hover:bg-primary text-white"
                            size="sm"
                            onClick={handleAvatarUpload}
                            disabled={isUploadingAvatar}
                          >
                            {isUploadingAvatar ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              "Upload"
                            )}
                          </Button>
                        )}
                      </div>
                      {file && (
                        <p className="text-sm mt-2">
                          Selected:{" "}
                          <span className="font-medium">{file.name}</span> (
                          {Math.round(file.size / 1024)} KB)
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="Your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">
                        Your email address cannot be changed
                      </p>
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        placeholder="Your phone number"
                        value={phoneNumber}
                        // onChange={(e) => setPhoneNumber(e.target.value)}
                        onChange={handlePhoneInputChange}
                      />
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="language">Preferred Language</Label>
                      <Select value={languageId} onValueChange={setLanguageId}>
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((language) => (
                            <SelectItem key={language.id} value={language.id}>
                              {language.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    className="bg-primary hover:bg-primary text-white"
                    onClick={handleUpdateProfile}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
