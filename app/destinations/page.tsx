"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  MapPin,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { axiosPrivate } from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/custom/image-uploader";
import { Textarea } from "@/components/ui/textarea";

/* ---------- TYPE ---------- */
interface Destination {
  id: string;
  name: string;
  description: string;
  region: string;
  country: string;
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string };
}

/* ---------- MAIN PAGE ---------- */
export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  /* fetch */
  const fetchDestinations = async () => {
    try {
      const { data } = await axiosPrivate.get("/destinations");
      setDestinations(data.data);
    } catch {
      toast({ title: "Failed to load destinations", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDestinations();
  }, []);

  /* delete */
  const handleDelete = async (id: string) => {
    try {
      await axiosPrivate.delete(`/destinations/${id}`);
      toast({ title: "Destination deleted" });
      fetchDestinations();
    } catch {
      toast({ title: "Could not delete", variant: "destructive" });
    }
  };

  const filtered = destinations.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  /* ---------- RENDER ---------- */
  return (
    <div className="flex-1 sm:px-16 px-6 py-6 overflow-auto">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Destinations</h1>
          <p className="text-muted-foreground">
            Manage all travel destinations in one place.
          </p>
        </div>
      </div>

      {/* controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search destinations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <CreateEditDialog onSuccess={fetchDestinations} />
      </div>

      {/* skeleton */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-40 w-full rounded-md mb-3" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border rounded-lg">
          <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No destinations yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first destination to get started.
          </p>
          <CreateEditDialog
            onSuccess={fetchDestinations}
            triggerLabel="Create Destination"
          />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dest) => (
            <Card key={dest.id} className="overflow-hidden">
              <div className="relative h-52">
                {dest.coverImage ? (
                  <Image
                    src={dest.coverImage}
                    alt={dest.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-accent flex items-center justify-center">
                    <MapPin className="h-16 w-16 text-primary" />
                  </div>
                )}
              </div>
              <CardHeader className="pb-1 flex justify-between items-start">
                <CardTitle className="text-lg">{dest.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <CreateEditDialog
                      destination={dest}
                      onSuccess={fetchDestinations}
                      triggerLabel="Edit"
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="text-red-500"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete “{dest.name}”.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => handleDelete(dest.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-1">
                  {dest.region}, {dest.country}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {dest.description}
                </p>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                Updated {formatDate(dest.updatedAt)}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- DIALOG FOR CREATE / EDIT ---------- */
function CreateEditDialog({
  destination,
  onSuccess,
  triggerLabel = "Create Destination",
}: {
  destination?: Destination;
  onSuccess: () => void;
  triggerLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const { toast } = useToast();

  /* form */
  const [form, setForm] = useState({
    name: "",
    description: "",
    region: "",
    country: "",
  });

  /* prefill on edit */
  useEffect(() => {
    if (destination) {
      setForm({
        name: destination.name,
        description: destination.description,
        region: destination.region,
        country: destination.country,
      });
      if (destination.coverImage) {
        setExistingImages([destination.coverImage]);
      } else {
        setExistingImages([]);
      }
    } else {
      setForm({
        name: "",
        description: "",
        region: "",
        country: "",
      });
    }
  }, [destination, open]);

  /* handlers */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    payload.append("name", form.name);
    payload.append("description", form.description);
    payload.append("region", form.region);
    payload.append("country", form.country);

    if (files.length !== 0) {
      payload.append("coverImage", files[0]);
    }

    try {
      if (destination) {
        await axiosPrivate.put(`/destinations/${destination.id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast({ title: "Destination updated" });
      } else {
        await axiosPrivate.post("/destinations", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast({ title: "Destination created" });
      }
      setOpen(false);
      onSuccess();
    } catch {
      toast({ title: "Operation failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {triggerLabel === "Create Destination" ? (
          <Button>
            <Plus size={16} className="mr-2" />
            {triggerLabel}
          </Button>
        ) : (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Edit className="mr-2 h-4 w-4" />
            {triggerLabel}
          </DropdownMenuItem>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {destination ? "Edit Destination" : "Create Destination"}
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <Input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              name="region"
              placeholder="Region"
              value={form.region}
              onChange={handleChange}
              required
            />
            <Input
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
              required
            />
            <Textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full rounded-md border p-2"
            />
            <ImageUploader
              existingImages={existingImages}
              value={files}
              onChange={setFiles}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
