"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { CalendarIcon, ChevronRight, MapPin, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { axiosPrivate } from "@/lib/axios";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import ImageUploader from "@/components/custom/image-uploader";

interface EventData {
  id: string;
  name: string;
  location: string;
  description: string;
  date: string;
  // bride: string;
  // groom: string;
}

export default function UpdateEvent() {
  const router = useRouter();
  const { id } = useParams();
  const eventId = id;
  const { toast } = useToast();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    date: new Date(),
    // bride: "",
    // groom: "",
  });

  useEffect(() => {
    if (!eventId) return;
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const response = await axiosPrivate.get(`/admin/event/${eventId}`);
      if (response.status === 200) {
        const data = response.data.data;
        setEvent(data);
        setFormData({
          name: data.name,
          location: data.location,
          description: data.description,
          date: new Date(data.date),
          // bride: data.bride || "",
          // groom: data.groom || "",
        });
        if (data.mediaUrls) {
          console.log(data.mediaUrls);
          setExistingImages([data.mediaUrls]);
        } else {
          setExistingImages([]);
        }
      }
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, date });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId) return;

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("location", formData.location);
      form.append("description", formData.description);
      form.append("date", formData.date.toISOString());
      // form.append("bride", formData.bride);
      // form.append("groom", formData.groom);
      if (files.length !== 0) {
        files.forEach((file) => form.append("files", file));
      }

      const response = await axiosPrivate.patch(
        `/admin/event/${eventId}`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.status === 200) {
        toast({ title: "Event updated successfully!" });
        window.location.href = "/";
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast({ title: "Error updating event" });
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 sm:px-16 px-6 py-6 overflow-auto">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-medium mb-2">Update Event</h1>

          <div className="flex items-center gap-2 text-sm mb-6">
            <span className="text-primary">Dashboard</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span>Update Event</span>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[...Array(6)].map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 font-medium">Title</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Event Date & Time
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <CalendarIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                      {formData.date
                        ? format(formData.date, "PPP p")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="block mb-2 font-medium">Location</label>
                <div className="relative">
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                  <MapPin className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>

              {/* <div>
                <label className="block mb-2 font-medium">Bride</label>
                <div className="relative">
                  <Input
                    name="bride"
                    value={formData.bride}
                    onChange={handleChange}
                    required
                  />
                  <User className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium">Groom</label>
                <div className="relative">
                  <Input
                    name="groom"
                    value={formData.groom}
                    onChange={handleChange}
                    required
                  />
                  <User className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                </div>
              </div> */}
              <div>
                <label className="block mb-2 font-medium">Upload Image</label>
                <div className="relative">
                  <ImageUploader
                    existingImages={existingImages}
                    multiple={true}
                    value={files}
                    onChange={setFiles}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                  className="px-8 text-primary"
                >
                  Cancel
                </Button>
                <Button type="submit" className="px-8">
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
