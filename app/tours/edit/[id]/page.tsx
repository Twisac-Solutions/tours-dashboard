"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { CalendarIcon, ChevronRight, MapPin } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import ImageUploader from "@/components/custom/image-uploader";
import { Switch } from "@/components/ui/switch";
import TourPreview from "@/components/TourPreview";

interface TourData {
  id: string;
  title: string;
  destination: {
    id: string;
    name: string;
  };
  description: string;
  startDate: string;
  endDate: string;
  coverImage: string;
  isFeatured: boolean;
  pricePerPerson: number;
  currency: string;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
}

interface Destination {
  id: string;
  name: string;
}

export default function UpdateTour() {
  const router = useRouter();
  const { id } = useParams();
  const tourId = id;
  const { toast } = useToast();
  const [tour, setTour] = useState<TourData | null>(null);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    destinationId: "",
    desc: "",
    startDate: new Date(),
    endDate: new Date(),
    pricePerPerson: 0,
    currency: "",
    isFeatured: false,
    categoryId: "",
    destination: "",
  });

  useEffect(() => {
    if (!tourId) return;
    fetchTour();
    fetchCategories();
    fetchDestinations();
  }, [tourId]);

  const fetchTour = async () => {
    try {
      const response = await axiosPrivate.get(`/tours/${tourId}`);
      if (response.status === 200) {
        const data = response.data;
        setTour(data);
        setFormData({
          title: data.title,
          destinationId: data.destination.id,
          desc: data.description,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          pricePerPerson: data.pricePerPerson,
          currency: data.currency,
          isFeatured: data.isFeatured,
          categoryId: data.categoryId,
          destination: data.destination.name,
        });
        if (data.coverImage) {
          setExistingImages([data.coverImage]);
        } else {
          setExistingImages([]);
        }
      }
    } catch (error) {
      console.error("Error fetching tour:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosPrivate.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchDestinations = async () => {
    try {
      const response = await axiosPrivate.get("/destinations");
      setDestinations(response.data.data);
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleDateChange = (date: Date | undefined, field: string) => {
    if (date) {
      setFormData({ ...formData, [field]: date });
    }
  };
  const handleFeaturedChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isFeatured: checked }));
  };

  const handleSelectChange =
    (name: keyof typeof formData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tourId) return;

    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("destinationId", formData.destinationId);
      form.append("description", formData.desc);
      form.append("startDate", formData.startDate.toISOString());
      form.append("endDate", formData.endDate.toISOString());
      form.append("pricePerPerson", String(formData.pricePerPerson));
      form.append("currency", formData.currency);
      form.append("isFeatured", String(formData.isFeatured));
      form.append("categoryId", formData.categoryId);

      if (files.length !== 0) {
        form.append("coverImage", files[0]);
      }

      const response = await axiosPrivate.put(`/tours/${tourId}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toast({ title: "Tour updated successfully!" });
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error updating tour:", error);
      toast({ title: "Error updating tour" });
    }
  };
  const destinationName =
    destinations.find((d) => d.id === formData.destinationId)?.name || "";
  const categoryName =
    categories.find((c) => c.id === formData.categoryId)?.name || "";

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 sm:px-16 px-6 py-6 overflow-auto">
        <div className="w-full">
          <h1 className="text-2xl font-medium mb-2">Update Tour</h1>
          <div className="flex items-center gap-2 text-sm mb-6">
            <span className="text-primary">Dashboard</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span>Update Tour</span>
          </div>
          {loading ? (
            <div className="space-y-6">
              {[...Array(6)].map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="max-w-3xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block mb-2 font-medium">Title</label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.desc}
                      onChange={handleChange}
                      rows={4}
                      className="w-full border rounded-md p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium">
                      Destination
                    </label>
                    <Select
                      value={formData.destinationId}
                      onValueChange={handleSelectChange("destinationId")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {destinations.map((d) => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block mb-2 font-medium">Category</label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={handleSelectChange("categoryId")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 font-medium">
                        Start Date
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left"
                          >
                            <CalendarIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                            {formData.startDate
                              ? format(formData.startDate, "PPP")
                              : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto">
                          <Calendar
                            mode="single"
                            selected={formData.startDate}
                            onSelect={(date) =>
                              handleDateChange(date, "startDate")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <label className="block mb-2 font-medium">End Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left"
                          >
                            <CalendarIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                            {formData.endDate
                              ? format(formData.endDate, "PPP")
                              : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto">
                          <Calendar
                            mode="single"
                            selected={formData.endDate}
                            onSelect={(date) =>
                              handleDateChange(date, "endDate")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 font-medium">
                        Price per Person
                      </label>
                      <Input
                        name="pricePerPerson"
                        type="number"
                        value={formData.pricePerPerson}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-medium">Currency</label>
                      <Input
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onCheckedChange={handleFeaturedChange}
                    />
                    <label
                      htmlFor="isFeatured"
                      className="text-sm font-medium leading-none"
                    >
                      Is Featured
                    </label>
                  </div>
                  <div>
                    <label className="block mb-2 font-medium">
                      Cover Image
                    </label>
                    <div className="relative">
                      <ImageUploader
                        existingImages={existingImages}
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
              </div>
              <div className="">
                <h2 className="text-xl font-medium mb-4 text-center">
                  Live Preview
                </h2>
                <div className="sticky top-6">
                  <TourPreview
                    formData={formData}
                    files={files}
                    existingCoverImage={existingImages[0]}
                    destinationName={destinationName}
                    categoryName={categoryName}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
