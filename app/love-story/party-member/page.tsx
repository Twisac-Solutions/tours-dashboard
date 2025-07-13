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
import Link from "next/link";
import { ChevronRight, Pencil, Trash } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePathname } from "next/navigation";
import ImageUploader from "@/components/custom/image-uploader";

interface PartyMember {
  id: string;
  name: string;
  role: string;
  description: string;
  mediaUrl: string;
  partyType: "BRIDESMAIDS" | "GROOMSMEN";
}

export default function ManagePartyMembersPage() {
  const { currentEvent } = useEvent();
  const eventId = currentEvent?.id || "";
  const { toast } = useToast();
  const pathname = usePathname();

  const [partyMembers, setPartyMembers] = useState<PartyMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<PartyMember | null>(
    null
  );

  const [partyType, setPartyType] = useState<"BRIDESMAIDS" | "GROOMSMEN" | "">(
    ""
  );
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    if (!eventId) return;
    fetchPartyMembers();
  }, [eventId]);

  const fetchPartyMembers = async () => {
    try {
      const response = await axiosPrivate.get(
        `/admin/event/${eventId}/our-story`
      );
      setPartyMembers(response.data.data.ourStoryPartyMember || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch party members",
        variant: "destructive",
      });
    }
  };

  const handleSelectMember = (member: PartyMember) => {
    setSelectedMember(member);
    setPartyType(member.partyType);
    setRole(member.role);
    setName(member.name);
    setDescription(member.description);
    setFile(null);
    if (member.mediaUrl) {
      setExistingImages([member.mediaUrl]);
    } else {
      setExistingImages([]);
    }
  };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setFile(e.target.files[0]);
  //   }
  // };

  // Create or Update Party Member
  const handleSubmit = async () => {
    if (!partyType || !role || !name || !description) {
      toast({
        title: "Error",
        description: "All fields are required!",
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("partyType", partyType);
      formData.append("role", role);
      formData.append("name", name);
      formData.append("description", description);
      if (file) formData.append("file", file);

      if (selectedMember) {
        // Update existing member
        await axiosPrivate.patch(
          `/admin/event/${eventId}/our-story/party-member/${selectedMember.id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast({ title: "Success", description: "Party member updated!" });
      } else {
        // Create new member
        const response = await axiosPrivate.post(
          `/admin/event/${eventId}/our-story/party-member`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setPartyMembers([...partyMembers, response.data.data]);
        toast({ title: "Success", description: "Party member added!" });
      }

      resetForm();
      fetchPartyMembers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save party member",
        variant: "destructive",
      });
    }
  };

  const handleListDelete = async (id: string) => {
    try {
      await axiosPrivate.delete(
        `/admin/event/${eventId}/our-story/party-member/${id}`
      );
      setPartyMembers(partyMembers.filter((m) => m.id !== id));
      toast({ title: "Success", description: "Party member deleted!" });
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete party member",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setSelectedMember(null);
    setPartyType("");
    setRole("");
    setName("");
    setDescription("");
    setFile(null);
    setExistingImages([]);
  };

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 sm:px-16 px-6 py-6 overflow-auto">
        <div className="max-w-7xl">
          <h1 className="text-2xl font-medium mb-2">Party Members</h1>

          <div className="flex items-center gap-2 text-sm mb-4">
            <Link href="/love-story" className="text-primary">
              Love Story
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span>Manage Party Members</span>
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
            {/* Left: Form */}
            <div className="space-y-6">
              <div>
                <Label className="block mb-2">Party Type</Label>
                <Select
                  value={partyType}
                  onValueChange={(value) =>
                    setPartyType(value as "BRIDESMAIDS" | "GROOMSMEN")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Party Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRIDESMAIDS">Bridesmaids</SelectItem>
                    <SelectItem value="GROOMSMEN">Groomsmen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="block mb-2">Role</Label>
                <Input
                  type="text"
                  placeholder="Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
              <div>
                <Label className="block mb-2">Name</Label>
                <Input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label className="block mb-2">Description</Label>
                <Textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <Label className="block mb-2">Image</Label>
                <ImageUploader
                  existingImages={existingImages}
                  value={file ? [file] : []}
                  multiple={false}
                  onChange={(files) => setFile(files?.[0] || null)}
                />
              </div>

              <div className="space-y-2">
                {selectedMember ? (
                  <>
                    <Button onClick={handleSubmit} className="w-full">
                      Update Party Member
                    </Button>
                    <Button
                      variant="outline"
                      onClick={resetForm}
                      className="w-full"
                    >
                      Cancel Edit
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleSubmit} className="w-full">
                    Add Party Member
                  </Button>
                )}
              </div>
            </div>

            {/* Right: List of Itinerary Items */}
            {partyMembers.length > 0 && (
              <div>
                {/* <h2 className="text-lg font-semibold mb-2">Existing Members</h2> */}
                <div className=" flex flex-col space-y-4">
                  {partyMembers.map((member) => (
                    <div key={member.id} className="border p-4 rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text">Preview</h3>
                        <div className="flex items-center ">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSelectMember(member)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            className="text-destructive"
                            size="sm"
                            onClick={() => handleListDelete(member.id)}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {member.mediaUrl && (
                          <img
                            src={member.mediaUrl}
                            alt="Member Image"
                            className="w-40 rounded-md mb-3"
                          />
                        )}
                        <div>
                          <h3 className="font-bold text-xl">
                            {member.name} - {member.role}
                          </h3>
                          <p className="text-muted-foreground">
                            {member.partyType}
                          </p>
                          <p className="text-muted-foreground">
                            {member.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
