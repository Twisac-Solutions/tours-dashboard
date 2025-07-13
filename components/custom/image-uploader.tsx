"use client";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ImageUploader({
  existingImages = [], // URLs from API
  value = [], // New uploads
  onChange,
  multiple = true,
}: {
  existingImages?: string[];
  value?: File[];
  onChange: (files: File[]) => void;
  multiple?: boolean;
}) {
  const { toast } = useToast();
  const [previews, setPreviews] = useState<string[]>([]);

  // Update previews when `value` or `existingImages` changes
  useEffect(() => {
    const newPreviews = value.map((file) => URL.createObjectURL(file));
    if (existingImages.length !== 0) {
      setPreviews([...existingImages, ...newPreviews]);
    } else {
      setPreviews([...newPreviews]);
    }

    return () => newPreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [value]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: multiple,
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        toast({
          title: "Unsupported File",
          description: "Only image files are allowed.",
          variant: "destructive",
        });
        return;
      }
      if (!multiple && acceptedFiles.length > 1) {
        toast({
          title: "Only One Image Allowed",
          description: "You can only upload a single image.",
          variant: "destructive",
        });
        return;
      }
      onChange([...value, ...acceptedFiles]);

      toast({
        title: "Image Added",
        description: `${acceptedFiles.length} image(s) selected.`,
      });
    },
  });

  const removeImage = (index: number) => {
    if (index < existingImages.length) {
      // Remove an existing image
      const updatedImages = existingImages.filter((_, i) => i !== index);
      setPreviews(updatedImages.concat(previews.slice(existingImages.length)));
    } else {
      // Remove a newly uploaded file
      const updatedFiles = value.filter(
        (_, i) => i !== index - existingImages.length,
      );
      onChange(updatedFiles);
    }
  };

  return (
    <div className="w-full border-2 border-dashed  p-4 rounded-lg text-center cursor-pointer  transition-colors">
      <div
        {...getRootProps()}
        className="flex flex-col items-center justify-center bg-muted hover:bg-secondary p-4 bg-m rounded-md"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center py-4">
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-1">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">
            PNG, JPG or JPEG (max. 5MB)
          </p>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-2">
          {previews.map((src, index) => (
            <div key={index} className="relative w-32">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md"
              />
              <Button
                variant="ghost"
                className="absolute top-0 mt-1 w-2 h-8 right-0 bg-white rounded-full shadow-md"
                onClick={() => removeImage(index)}
              >
                <X className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-muted-foreground mt-2">
        Leave empty to keep the current image
      </p>
    </div>
  );
}
