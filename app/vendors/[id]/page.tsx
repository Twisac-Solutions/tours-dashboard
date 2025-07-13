"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { axiosPrivate } from "@/lib/axios";
import { useEvent } from "@/providers/EventProvider";
import { ChevronRight, User } from "lucide-react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/components/custom/image-uploader";
import { useParams } from "next/navigation";
import { VendorDetailSection } from "@/data/api";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";

export default function CreateVendor() {
  const { currentEvent } = useEvent();
  const eventId = currentEvent?.id || "";
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [vendorDetail, setVendorDetail] = useState<VendorDetailSection | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (eventId && id) {
      fetchVendorDetail();
    }
  }, [eventId, id]);

  const fetchVendorDetail = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get(
        `/admin/event/${eventId}/vendor-detail/${id}`
      );

      if (response.data?.data) {
        setVendorDetail(response.data.data);
        setTitle(response.data.data.title);
        setContent(response.data.data.content);
        if (response.data.data.mediaUrls) {
          console.log(response.data.data.mediaUrls);
          setExistingImages([response.data.data.mediaUrls]);
        } else {
          setExistingImages([]);
        }
      }
    } catch (error) {
      toast({
        title: "Error fetching vendor detail",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
      const response = await axiosPrivate.patch(
        `/admin/event/${eventId}/vendor-detail/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        toast({
          title: "Vendor Updated successfully!",
        });
        fetchVendorDetail();
      }

      //   window.location.href = "/vendors";
    } catch (error) {
      toast({ title: "Failed to update vendor", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 sm:px-16 px-6 py-6 overflow-auto">
        <div className="w-full">
          <h1 className="text-2xl font-medium mb-2">Update Vendor</h1>

          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-primary">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span>Update Vendor</span>
          </div>
          <div>
            {loading ? (
              <Card className="p-4 space-y-4">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-full h-16" />
                <Skeleton className="w-full h-48" />
              </Card>
            ) : vendorDetail ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                      existingImages={existingImages}
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
                    <Button
                      type="submit"
                      className="px-8"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Updating..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
                <Card className="overflow-hidden">
                  <div className="relative h-96 cursor-pointer">
                    {vendorDetail.mediaUrls &&
                    vendorDetail.mediaUrls.length > 0 ? (
                      <Image
                        src={vendorDetail.mediaUrls[0]}
                        alt={vendorDetail.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                        <User className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2 flex flex-row justify-between items-start">
                    <CardTitle className="text-xl cursor-pointer hover:text-primary transition-colors">
                      {vendorDetail.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-muted-foreground">
                      {vendorDetail.content}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2"></CardFooter>
                </Card>
              </div>
            ) : (
              <p className="text-muted-foreground">No vendor detail found.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
