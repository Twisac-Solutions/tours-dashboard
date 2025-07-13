"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { axiosPrivate } from "@/lib/axios";
import { useEvent } from "@/providers/EventProvider";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePathname } from "next/navigation";
import ImageUploader from "@/components/custom/image-uploader";
import { set } from "date-fns";

interface FavoriteCharacteristic {
  id: string;
  trait: string;
  description: string;
  host: "bride" | "groom";
  mediaUrl?: string;
}

export default function FavoriteCharacteristicPage() {
  const { currentEvent } = useEvent();
  const eventId = currentEvent?.id || "";
  const { toast } = useToast();

  // Form states
  const [trait, setTrait] = useState("");
  const [description, setDescription] = useState("");
  const [host, setHost] = useState<"bride" | "groom">("bride");
  const [file, setFile] = useState<File | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [characteristics, setCharacteristics] = useState<
    FavoriteCharacteristic[]
  >([]);
  const [editingCharacteristicId, setEditingCharacteristicId] = useState<
    string | null
  >(null);
  const pathname = usePathname();

  useEffect(() => {
    fetchCharacteristics();
  }, [eventId]);

  const fetchCharacteristics = async () => {
    try {
      const response = await axiosPrivate.get(
        `/admin/event/${eventId}/our-story`
      );
      setCharacteristics(response.data.data.favoriteCharacteristic || []);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleAddCharacteristic = async () => {
    try {
      const formData = new FormData();
      formData.append("trait", trait);
      formData.append("description", description);
      formData.append("host", host);
      if (file) formData.append("file", file);

      const response = await axiosPrivate.post(
        `/admin/event/${eventId}/our-story/favorite-characteristic`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setCharacteristics([...characteristics, response.data.data]);
      resetForm();
      fetchCharacteristics();
      toast({
        title: "Success",
        description: "Characteristic added successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add characteristic",
        variant: "destructive",
      });
    }
  };

  const handleEditCharacteristic = (char: FavoriteCharacteristic) => {
    setTrait(char.trait);
    setDescription(char.description);
    setHost(char.host);
    setEditingCharacteristicId(char.id);
    if (char.mediaUrl) {
      setExistingImages([char.mediaUrl]);
    } else {
      setExistingImages([]);
    }
  };

  const handleUpdateCharacteristic = async () => {
    if (!editingCharacteristicId) return;

    try {
      await axiosPrivate.patch(
        `/admin/event/${eventId}/our-story/favorite-characteristic/${editingCharacteristicId}`,
        { trait, description, host, file },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setCharacteristics(
        characteristics.map((char) =>
          char.id === editingCharacteristicId
            ? { ...char, trait, description, host }
            : char
        )
      );
      resetForm();
      fetchCharacteristics();
      toast({
        title: "Updated",
        description: "Characteristic updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update characteristic",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCharacteristic = async (id: string) => {
    try {
      await axiosPrivate.delete(
        `/admin/event/${eventId}/our-story/favorite-characteristic/${id}`
      );
      setCharacteristics(characteristics.filter((char) => char.id !== id));
      toast({
        title: "Deleted",
        description: "Characteristic deleted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete characteristic",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setTrait("");
    setDescription("");
    setHost("bride");
    setFile(null);
    setEditingCharacteristicId(null);
    setExistingImages([]);
  };

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 sm:px-16 px-6 py-6 overflow-auto">
        <div className="max-w-7xl">
          <h1 className="text-2xl font-medium mb-2">
            Favorite Characteristics
          </h1>

          <div className="flex items-center gap-2 text-sm mb-4">
            <Link href="/love-story" className="text-primary">
              Love Story
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span>Characteristics</span>
          </div>
          <div className="border-b  mb-6">
            <div className="flex space-x-4">
              <Link
                href="/love-story"
                className={`py-2 px-4 ${
                  pathname === "/love-story"
                    ? "border-b-2 border-primary font-medium"
                    : "border-transparent border-b-2 text-muted-foreground  hover:border-rose-200"
                }`}
              >
                Overview
              </Link>
              <Link
                href="/love-story/characteristics"
                className={`py-2 px-4 ${
                  pathname === "/love-story/characteristics"
                    ? "border-b-2 border-primary font-medium"
                    : "border-transparent border-b-2 text-muted-foreground  hover:border-rose-200"
                }`}
              >
                Characteristics
              </Link>
              <Link
                href="/love-story/party-member"
                className={`py-2 px-4 ${
                  pathname === "/love-story/party-member"
                    ? "border-b-2 border-primary font-medium"
                    : "border-transparent border-b-2 text-muted-foreground  hover:border-rose-200"
                }`}
              >
                Party Members
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="space-y-6">
              <div>
                <Label className="block mb-3">Trait</Label>
                <Input
                  type="text"
                  placeholder="Trait"
                  value={trait}
                  onChange={(e) => setTrait(e.target.value)}
                />
              </div>

              <div>
                <Label className="block mb-3">Description</Label>
                <Textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <Label className="block mb-3">Host</Label>
                <Select
                  value={host}
                  onValueChange={(value: "bride" | "groom") => setHost(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Host" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bride">Bride</SelectItem>
                    <SelectItem value="groom">Groom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="block mb-3">Image</Label>
                <ImageUploader
                  existingImages={existingImages}
                  value={file ? [file] : []}
                  multiple={false}
                  onChange={(files) => setFile(files?.[0] || null)}
                />
              </div>

              {editingCharacteristicId ? (
                <div className="space-y-2 gap-2">
                  <Button
                    onClick={handleUpdateCharacteristic}
                    className="w-full"
                  >
                    Update Characteristic
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetForm}
                    className="w-full"
                  >
                    Cancel Edit
                  </Button>
                </div>
              ) : (
                <Button onClick={handleAddCharacteristic} className="w-full">
                  Add Characteristic
                </Button>
              )}
            </div>

            {/* List of Characteristics */}
            <div className="space-y-6 mt-4">
              {characteristics.length === 0 ? (
                <p className="text-muted-foreground">
                  No characteristics added yet.
                </p>
              ) : (
                characteristics.map((char) => (
                  <div key={char.id} className="border p-4 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text">Preview</h3>
                      <div className="flex items-center ">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCharacteristic(char)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-destructive"
                          size="sm"
                          onClick={() => handleDeleteCharacteristic(char.id)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {char.mediaUrl && (
                      <img
                        src={char.mediaUrl}
                        alt="Character Image"
                        className="w-40 rounded-md mb-3"
                      />
                    )}
                    <h3 className="font-bold text-xl">{char.trait}</h3>
                    <p className="text-muted-foreground">{char.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
