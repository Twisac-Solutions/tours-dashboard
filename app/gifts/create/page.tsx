"use client";
import { useState } from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronRight,
  Loader2,
  MapPin,
  Search,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { axiosPrivate } from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import ImageUploader from "@/components/custom/image-uploader";
import { Label } from "@/components/ui/label";
import { useEvent } from "@/providers/EventProvider";

export default function CreateEvent() {
  const { currentEvent } = useEvent();
  const eventId = currentEvent?.id ?? "";
  const [loading, setLoading] = useState(false);
  const [giftName, setGiftName] = useState("");
  const [goal, setGoal] = useState<number | "">("");
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftName || !goal || !file) {
      toast({ title: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", giftName);
      formData.append("goal", goal.toString());
      formData.append("file", file);

      await axiosPrivate.post(`/admin/event/${eventId}/gifts`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({ title: "Success", description: "Gift created successfully!" });
      resetForm();
      window.location.href = "/gifts";
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create gift.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setGiftName("");
    setGoal("");
    setFile(null);
  };

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 sm:px-16 px-6 py-6 overflow-auto">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-medium mb-2">Create Gift</h1>

          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/gifts" className="text-primary">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span>Create Gift</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="gift-name">Gift Name</Label>
                <Input
                  id="gift-name"
                  placeholder="e.g., Honeymoon Fund"
                  value={giftName}
                  onChange={(e) => setGiftName(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="gift-goal">Goal Amount ($)</Label>
                <Input
                  id="gift-goal"
                  type="number"
                  placeholder="e.g., 1000"
                  value={goal}
                  onChange={(e) => setGoal(Number(e.target.value))}
                />
              </div>
              <div className="grid gap-2">
                <Label>Gift Image</Label>
                <ImageUploader
                  value={file ? [file] : []}
                  multiple={false}
                  onChange={(files) => setFile(files?.[0] || null)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-16">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push("/gifts")}
                className="px-8 text-primary"
              >
                Back
              </Button>
              <Button type="submit" className="px-8" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Save & Continue"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
