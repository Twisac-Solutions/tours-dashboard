"use client";
import { useState } from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronRight,
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

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    date: new Date(),
    bride: "",
    groom: "",
  });

  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle date selection
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, date });
    }
  };
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("location", formData.location);
    data.append("description", formData.description);
    data.append("date", formData.date.toISOString()); // Convert to ISO string
    data.append("bride", formData.bride);
    data.append("groom", formData.groom);
    if (files.length !== 0) {
      files.forEach((file) => data.append("files", file));
    }

    try {
      const response = await axiosPrivate.post("/admin/event", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        //   withCredentials: true, // If authentication is needed
      });

      toast({ title: "Event created successfully!" });
      setFormData({
        name: "",
        location: "",
        description: "",
        date: new Date(),
        bride: "",
        groom: "",
      });
      setFiles([]);
      window.location.href = `/events`;
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 sm:px-16 px-6 py-6 overflow-auto">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-medium mb-2">Create Event</h1>

          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-primary">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span>Create Event</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">Title</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Event Name"
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
                  placeholder="Enter Event Location"
                  required
                />
                <MapPin className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium">Description</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleTextareaChange}
                placeholder="Enter Event Description"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Bride</label>
              <div className="relative">
                <Input
                  name="bride"
                  value={formData.bride}
                  onChange={handleChange}
                  placeholder="Bride Name"
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
                  placeholder="Groom Name"
                  required
                />
                <User className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium">Upload Image</label>
              <div className="relative">
                <ImageUploader
                  multiple={true}
                  value={files}
                  onChange={setFiles}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-16">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                className="px-8 text-primary"
              >
                Back
              </Button>
              <Button type="submit" className="px-8" disabled={loading}>
                {loading ? "Saving..." : "Save and Continue"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
