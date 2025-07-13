"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { axiosPrivate } from "@/lib/axios";
import { useEvent } from "@/providers/EventProvider";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/components/custom/image-uploader";

export default function CreateVendor() {
  const { currentEvent } = useEvent();
  const eventId = currentEvent?.id || "";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      toast({ title: "Please fill in all fields.", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (files.length !== 0) {
      files.forEach((file) => formData.append("files", file));
    }
    setIsSubmitting(true);

    try {
      const response = await axiosPrivate.post(
        `/admin/event/${eventId}/vendor-detail`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast({
        title: "Vendor created successfully!",
      });
      window.location.href = "/vendors";
    } catch (error) {
      toast({ title: "Failed to create vendor", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 sm:px-16 px-6 py-6 overflow-auto">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-medium mb-2">Create Vendor</h1>

          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-primary">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span>Create Vendor</span>
          </div>
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="block mb-3">Vendor Name/Title</Label>
                <Input
                  type="text"
                  placeholder="Enter Vendor Name / Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label className="block mb-3">Description</Label>
                <Textarea
                  placeholder="Enter description"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>

              {/* File Upload */}
              <div>
                <Label className="block mb-3">Upload Image</Label>
                <ImageUploader
                  multiple={true}
                  value={files}
                  onChange={setFiles}
                />
              </div>

              <div className="flex justify-end gap-4 mt-16">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => window.history.back()}
                  className="px-8 text-primary"
                >
                  Back
                </Button>
                <Button type="submit" className="px-8" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Save and Continue"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
