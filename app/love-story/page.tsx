"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { axiosPrivate } from "@/lib/axios";
import { useEvent } from "@/providers/EventProvider";
import { ChevronRight, Pencil, Trash, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { OurStoryData, OurStoryResponse, OurStorySection } from "@/data/api";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/components/custom/image-uploader";
import LoveStory from "@/components/love-story";

export default function CreateOrUpdateOurStory() {
  const { currentEvent } = useEvent();
  const eventId = currentEvent?.id || "";
  const [ourStory, setOurStory] = useState<OurStoryData | null>(null);
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // State for adding a new section
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionContent, setSectionContent] = useState("");
  const [sectionFiles, setSectionFiles] = useState<File[]>([]);
  const [existingSectionImages, setExistingSectionImages] = useState<string[]>(
    []
  );
  // Section State
  const [editingSection, setEditingSection] = useState<OurStorySection | null>(
    null
  );

  // Fetch Our Story
  useEffect(() => {
    if (!eventId) return;
    fetchOurStory();
  }, [eventId]);

  const fetchOurStory = async () => {
    try {
      const response = await axiosPrivate.get<OurStoryResponse>(
        `/admin/event/${eventId}/our-story`
      );

      if (response.data?.data) {
        setOurStory(response.data.data);
        setBrideName(response.data.data.brideName);
        setGroomName(response.data.data.groomName);
        setWeddingDate(response.data.data.weddingDate.split("T")[0]); // Format Date
        if (response.data.data.mediaUrl) {
          setExistingImages([response.data.data.mediaUrl]); // Assuming API returns an array of URLs
        } else {
          setExistingImages([]);
        }
      }
    } catch (error) {
      console.error("Error fetching our story", error);
    }
  };

  // Handle Create or Update Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!brideName || !groomName || !weddingDate) {
      toast({ title: "Please fill in all fields.", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    formData.append("brideName", brideName);
    formData.append("groomName", groomName);
    formData.append("weddingDate", weddingDate);
    if (file) formData.append("file", file);

    setIsSubmitting(true);

    try {
      const response = ourStory
        ? await axiosPrivate.patch(
            `/admin/event/${eventId}/our-story`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          )
        : await axiosPrivate.post(
            `/admin/event/${eventId}/our-story`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

      toast({
        title: ourStory
          ? "Our Story updated successfully!"
          : "Our Story created successfully!",
      });

      if (response.data?.data) {
        setOurStory(response.data.data);
      }
      fetchOurStory();
    } catch (error) {
      toast({ title: "Failed to save Our Story", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Adding a New Section
  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", sectionTitle);
    formData.append("content", sectionContent);
    sectionFiles.forEach((file) => formData.append("files", file));

    try {
      await axiosPrivate.post(
        `/admin/event/${eventId}/our-story/section`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast({ title: "Section added successfully!" });
      fetchOurStory();
      setSectionTitle("");
      setSectionContent("");
      setSectionFiles([]);
      setExistingSectionImages([]);
    } catch {
      toast({ title: "Failed to add section", variant: "destructive" });
    }
  };

  // Handle Updating a Section
  const handleUpdateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    const formData = new FormData();
    formData.append("title", sectionTitle);
    formData.append("content", sectionContent);
    sectionFiles.forEach((file) => formData.append("files", file));

    try {
      await axiosPrivate.patch(
        `/admin/event/${eventId}/our-story/section/${editingSection.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast({ title: "Section updated successfully!" });
      fetchOurStory();
      setEditingSection(null);
      setSectionTitle("");
      setSectionContent("");
      setExistingSectionImages([]);
      setSectionFiles([]);
    } catch {
      toast({ title: "Failed to update section", variant: "destructive" });
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      await axiosPrivate.delete(
        `/admin/event/${eventId}/our-story/section/${sectionId}`
      );
      toast({ title: "Section deleted successfully!" });
      fetchOurStory();
    } catch {
      toast({ title: "Failed to delete section", variant: "destructive" });
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 sm:px-16 px-6 py-6 overflow-auto">
        <div className="w-full">
          <h1 className="text-2xl font-medium mb-2">
            {ourStory ? "Update Love Story" : "Create Love Story"}
          </h1>

          <div className="flex items-center gap-2 text-sm mb-4">
            <Link href="/" className="text-primary">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span>{ourStory ? "Update Love Story" : "Create Love Story"}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
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

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Bride Name */}
                <div>
                  <Label className="block mb-3">Brides Name</Label>
                  <Input
                    type="text"
                    placeholder="Enter bride's name"
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    required
                  />
                </div>

                {/* Groom Name */}
                <div>
                  <Label className="block mb-3">Grooms Name</Label>
                  <Input
                    type="text"
                    placeholder="Enter groom's name"
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    required
                  />
                </div>

                {/* Wedding Date */}
                <div>
                  <Label className="block mb-3">Wedding Date</Label>
                  <Input
                    type="date"
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    required
                  />
                </div>

                {/* File Upload */}
                <div>
                  <Label className="block mb-3">Upload Image</Label>
                  <ImageUploader
                    existingImages={existingImages}
                    value={file ? [file] : []}
                    multiple={false}
                    onChange={(files) => setFile(files?.[0] || null)}
                  />
                </div>

                <Button type="submit" className="px-8" disabled={isSubmitting}>
                  {isSubmitting
                    ? ourStory
                      ? "Updating..."
                      : "Creating..."
                    : ourStory
                    ? "Update"
                    : "Create"}
                </Button>
              </form>

              {/* Sections */}
              {ourStory && (
                <div>
                  <h2 className="text-2xl font-medium mt-6">Sections</h2>
                  <p className="text-muted-foreground font-medium mb-6">
                    Add new sections to your story
                  </p>
                  <div className="space-y-6">
                    {ourStory?.ourStorySections?.map((section) => (
                      <div key={section.id} className="border p-4 rounded-md">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text">Preview</h3>
                          <div className="flex items-center ">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingSection(section); // Set the section being edited
                                setSectionTitle(section.title);
                                setSectionContent(section.content);
                                if (section.mediaUrls.length > 0) {
                                  setExistingSectionImages(section.mediaUrls);
                                } else {
                                  setExistingSectionImages([]);
                                }
                                setSectionFiles([]); // Reset file selection
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              className="text-destructive"
                              size={"sm"}
                              onClick={() => handleDeleteSection(section.id)}
                            >
                              <Trash className="w-4 h-4" />
                              Delete
                            </Button>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-2 mb-3">
                          {section.mediaUrls.map((url, idx) => (
                            <img
                              key={idx}
                              src={url}
                              alt="Section Image"
                              className="w-40 rounded-md"
                            />
                          ))}
                        </div>
                        <h3 className="font-bold text-xl">{section.title}</h3>
                        <p className="text-muted-foreground">
                          {section.content}
                        </p>
                      </div>
                    ))}
                  </div>

                  <form
                    onSubmit={
                      editingSection ? handleUpdateSection : handleAddSection
                    }
                    className="mt-4 space-y-4"
                  >
                    {/* Title Input */}
                    <div>
                      <Label className="block mb-3">Title</Label>
                      <Input
                        value={sectionTitle}
                        onChange={(e) => setSectionTitle(e.target.value)}
                        required
                      />
                    </div>

                    {/* Content Input */}
                    <div>
                      <Label className="block mb-3">Content</Label>
                      <Textarea
                        value={sectionContent}
                        onChange={(e) => setSectionContent(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>

                    {/* File Upload */}
                    <div>
                      <Label className="block mb-3">Upload Files</Label>
                      <ImageUploader
                        existingImages={existingSectionImages}
                        multiple={true}
                        value={sectionFiles}
                        onChange={setSectionFiles}
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2">
                      {editingSection ? (
                        <>
                          <Button type="submit">Update Section</Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setEditingSection(null);
                              setSectionTitle("");
                              setSectionContent("");
                              setExistingSectionImages([]);
                              setSectionFiles([]);
                            }}
                          >
                            Cancel Edit
                          </Button>
                        </>
                      ) : (
                        <Button type="submit">Add Section</Button>
                      )}
                    </div>
                  </form>
                </div>
              )}
            </div>
            {ourStory && <LoveStory ourStory={ourStory} />}
          </div>
        </div>
      </main>
    </div>
  );
}
