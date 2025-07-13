"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { axiosPrivate } from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import ImageUploader from "@/components/custom/image-uploader";
import TourPreview from "@/components/TourPreview";
import { Switch } from "@/components/ui/switch";

interface Category {
  id: string;
  name: string;
}

interface Destination {
  id: string;
  name: string;
}
export default function CreateTour() {
  const [formData, setFormData] = useState({
    title: "",
    destinationId: "",
    categoryId: "",
    desc: "",
    startDate: new Date(),
    endDate: new Date(),
    pricePerPerson: 0,
    currency: "",
    isFeatured: false,
  });

  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
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

    fetchCategories();
    fetchDestinations();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData({ ...formData, [name]: val });
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
    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("destinationId", formData.destinationId);
    data.append("categoryId", formData.categoryId);
    data.append("desc", formData.desc);
    data.append("startDate", formData.startDate.toISOString());
    data.append("endDate", formData.endDate.toISOString());
    data.append("pricePerPerson", String(formData.pricePerPerson));
    data.append("currency", formData.currency);
    data.append("isFeatured", String(formData.isFeatured));

    if (files.length !== 0) {
      data.append("coverImage", files[0]);
    }

    try {
      const response = await axiosPrivate.post("/tours", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({ title: "Tour created successfully!" });
      setFormData({
        title: "",
        destinationId: "",
        categoryId: "",
        desc: "",
        startDate: new Date(),
        endDate: new Date(),
        pricePerPerson: 0,
        currency: "",
        isFeatured: false,
      });
      setFiles([]);
      window.location.href = `/tours`;
    } catch (error) {
      console.error("Error creating tour:", error);
      toast({
        title: "Error",
        description: "Failed to create tour.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
          <h1 className="text-2xl font-medium mb-2">Create Tour</h1>
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-primary">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span>Create Tour</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="max-w-3xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block mb-2 font-medium">Title</label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter Tour Title"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Description</label>
                  <Textarea
                    name="desc"
                    value={formData.desc}
                    onChange={handleChange}
                    placeholder="Enter Tour Description"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Destination</label>
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
                    <label className="block mb-2 font-medium">Start Date</label>
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
                          onSelect={(date) => handleDateChange(date, "endDate")}
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
                  <label className="block mb-2 font-medium">Cover Image</label>
                  <div className="relative">
                    <ImageUploader value={files} onChange={setFiles} />
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
            <div className="">
              <h2 className="text-xl font-medium mb-4 text-center">
                Live Preview
              </h2>
              <div className="sticky top-6">
                <TourPreview
                  formData={formData}
                  files={files}
                  // existingCoverImage={files[0].name}
                  destinationName={destinationName}
                  categoryName={categoryName}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
