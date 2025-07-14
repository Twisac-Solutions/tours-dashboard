"use client";

import { useEffect, useState } from "react";
import { MapPin, Tag } from "lucide-react";
import { format } from "date-fns";
interface TourPreviewProps {
  formData: {
    title: string;
    description: string;
    about: string;
    startDate: Date;
    endDate: Date;
    pricePerPerson: number;
    currency: string;
    isFeatured: boolean;
  };
  files: File[];
  existingCoverImage?: string;
  destinationName?: string;
  categoryName?: string;
}

const TourPreview = ({
  formData,
  files,
  existingCoverImage,
  destinationName,
  categoryName,
}: TourPreviewProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>();

  useEffect(() => {
    if (files && files.length > 0) {
      const newPreview = URL.createObjectURL(files[0]);
      setPreviewImage(newPreview);
      return () => URL.revokeObjectURL(newPreview);
    } else {
      setPreviewImage(existingCoverImage);
    }
  }, [files, existingCoverImage]);

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-lg overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <img
          src={previewImage || `https://placehold.co/600x400?text=Image`}
          alt={formData.title}
          className="w-full h-64 object-cover"
        />
        {formData.isFeatured && (
          <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded-full shadow-md">
            Featured
          </div>
        )}
        <div className="absolute bottom-0 left-0 p-6">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {formData.title || "Tour Title"}
          </h2>
          <div className="flex items-center text-gray-200 mt-2">
            <MapPin className="h-5 w-5 mr-2" />
            <span className="font-medium">
              {destinationName || "Destination"}
            </span>
          </div>
        </div>
      </div>
      <div className="p-6 bg-card">
        <div className="grid grid-cols-2 gap-4 text-center mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Start Date</p>
            <p className="font-semibold text-lg">
              {format(formData.startDate, "MMM d, yyyy")}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">End Date</p>
            <p className="font-semibold text-lg">
              {format(formData.endDate, "MMM d, yyyy")}
            </p>
          </div>
        </div>
        <div className="border-t pt-4">
          <p className="text-3xl font-bold text-center">
            {formData.currency}
            {formData.pricePerPerson}
            <span className="text-base font-normal text-muted-foreground">
              / person
            </span>
          </p>
        </div>
        <div className="border-t mt-4 pt-4">
          <h3 className="font-semibold text-lg mb-2">About this tour</h3>
          <p className="text-muted-foreground text-sm mb-4">
            {formData.description || "The tour description will be shown here."}
          </p>
          <div className="flex items-center text-sm text-muted-foreground">
            <Tag className="h-4 w-4 mr-2" />
            <span>Category: {categoryName || "Not set"}</span>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            {formData.about || "The tour about will be shown here."}
          </p>
        </div>
      </div>
    </div>
  );
};
export default TourPreview;
