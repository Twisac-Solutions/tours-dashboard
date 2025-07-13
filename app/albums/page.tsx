"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Edit,
  ImagePlus,
  Loader2,
  MoreHorizontal,
  Plus,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Folder,
  FolderOpen,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { useToast } from "@/hooks/use-toast";
import { axiosPrivate } from "@/lib/axios";
import { useEvent } from "@/providers/EventProvider";

// Define types for the API responses
interface Album {
  id: string;
  name: string;
}

interface AlbumsResponse {
  metadata: {
    total: number;
  };
  data: Album[];
}

interface Guest {
  id: string;
  name: string;
  avatar: string;
}

interface AlbumInfo {
  id: string;
  name: string;
}

interface Photo {
  id: string;
  media_url: string;
  guest: Guest;
  album: AlbumInfo;
}

interface PhotosResponse {
  count: number;
  next: string | null;
  previous: string | null;
  data: Photo[];
}

export default function AlbumsPage() {
  const { currentEvent } = useEvent();
  const eventId = currentEvent?.id ?? "";
  // State for albums
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for selected album and photos
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [photosError, setPhotosError] = useState<string | null>(null);

  // State for create/edit album
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [albumName, setAlbumName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add these state variables after the existing state declarations
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const { toast } = useToast();

  // Fetch albums
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const res = await axiosPrivate.get(`/admin/event/${eventId}/album`);
        setAlbums(res.data.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch albums",
          variant: "destructive",
        });
        setError("Failed to load albums. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [eventId]);

  // Fetch photos for selected album
  useEffect(() => {
    const fetchPhotos = async () => {
      if (!selectedAlbum) return;

      try {
        setPhotosLoading(true);
        const res = await axiosPrivate.get(
          `/admin/event/${eventId}/album/${selectedAlbum.id}/photos`,
        );
        setPhotos(res.data.data);
      } catch (error) {
        console.error("Failed to fetch photos:", error);
        setPhotosError("Failed to load photos. Please try again.");
        toast({
          title: "Error",
          description: "Failed to fetch photos",
          variant: "destructive",
        });
      } finally {
        setPhotosLoading(false);
      }
    };

    fetchPhotos();
  }, [selectedAlbum, eventId]);

  // Handle creating a new album
  const handleCreateAlbum = async () => {
    if (!albumName.trim()) {
      toast({
        title: "Error",
        description: "Album name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await axiosPrivate.post(`/admin/event/${eventId}/album`, {
        name: albumName,
      });

      setAlbums([...albums, res.data.data]);
      setAlbumName("");
      setIsSubmitting(false);
      setIsCreateSheetOpen(false);

      toast({
        title: "Album created",
        description: "Your album has been created successfully.",
      });
    } catch (error) {
      console.error("Failed to create album:", error);
      setIsSubmitting(false);

      toast({
        title: "Error",
        description: "Failed to create album. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle updating an album
  const handleUpdateAlbum = async () => {
    if (!selectedAlbum || !albumName.trim()) {
      toast({
        title: "Error",
        description: "Album name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      await axiosPrivate.patch(
        `/admin/event/${eventId}/album/${selectedAlbum.id}`,
        {
          name: albumName,
        },
      );

      setAlbums(
        albums.map((album) =>
          album.id === selectedAlbum.id ? { ...album, name: albumName } : album,
        ),
      );

      setAlbumName("");
      setIsSubmitting(false);
      setIsEditSheetOpen(false);

      toast({
        title: "Album updated",
        description: "Your album has been updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update album:", error);
      setIsSubmitting(false);

      toast({
        title: "Error",
        description: "Failed to update album. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle deleting an album
  const handleDeleteAlbum = async (albumToDelete: string) => {
    if (!albumToDelete) return;

    try {
      const res = await axiosPrivate.delete(
        `/admin/event/${eventId}/album/${albumToDelete}`,
      );
      setAlbums(albums.filter((album) => album.id !== albumToDelete));
      if (selectedAlbum?.id === albumToDelete) setSelectedAlbum(null);

      // If the deleted album was selected, clear the selection
      if (selectedAlbum && selectedAlbum.id === albumToDelete) {
        setSelectedAlbum(null);
        setPhotos([]);
      }

      toast({
        title: "Album deleted",
        description: "Your album has been deleted successfully.",
      });
    } catch (error) {
      console.error("Failed to delete album:", error);

      toast({
        title: "Error",
        description: "Failed to delete album. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle deleting a photo
  const handleDeletePhoto = async (photoToDelete: string) => {
    if (!photoToDelete) return;

    try {
      const res = await axiosPrivate.delete(
        `/admin/event/${eventId}/album/photo/${photoToDelete}`,
      );
      setPhotos(photos.filter((photo) => photo.id !== photoToDelete));

      toast({
        title: "Photo deleted",
        description: "The photo has been deleted successfully.",
      });
    } catch (error) {
      console.error("Failed to delete photo:", error);

      toast({
        title: "Error",
        description: "Failed to delete photo. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Open edit Sheet with album data
  const openEditSheet = (album: Album) => {
    setSelectedAlbum(album);
    setAlbumName(album.name);
    setIsEditSheetOpen(true);
  };

  // Add these functions before the return statement
  // Open full screen viewer for a specific photo
  const openFullScreenViewer = (index: number) => {
    setCurrentPhotoIndex(index);
    setIsFullScreenOpen(true);
  };

  // Navigate to the next photo
  const showNextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  // Navigate to the previous photo
  const showPreviousPhoto = () => {
    setCurrentPhotoIndex(
      (prevIndex) => (prevIndex - 1 + photos.length) % photos.length,
    );
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullScreenOpen) return;

      if (e.key === "ArrowRight") {
        showNextPhoto();
      } else if (e.key === "ArrowLeft") {
        showPreviousPhoto();
      } else if (e.key === "Escape") {
        setIsFullScreenOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullScreenOpen, photos.length]);

  return (
    <div>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Photo Albums</h1>
              <p className="text-muted-foreground">
                Create and manage photo albums for your event
              </p>
            </div>
            <div className="space-y-4">
              <Sheet
                open={isCreateSheetOpen}
                onOpenChange={setIsCreateSheetOpen}
              >
                <SheetTrigger asChild>
                  <Button className="bg-primary hover:bg-pink-600 text-white">
                    <Plus size={16} className="mr-2" />
                    Create Album
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Create New Album</SheetTitle>
                    <SheetDescription>
                      Create a new album to organize your event photos.
                    </SheetDescription>
                  </SheetHeader>

                  <div className="grid  gap-4 py-4">
                    <div className="grid gap-4">
                      <Label htmlFor="album-name">Album Name</Label>
                      <Input
                        id="album-name"
                        placeholder="e.g., Wedding Ceremony"
                        value={albumName}
                        onChange={(e) => setAlbumName(e.target.value)}
                      />
                    </div>
                  </div>

                  <SheetFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setAlbumName("");
                        setIsCreateSheetOpen(false);
                      }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-primary hover:bg-pink-600 text-white"
                      onClick={handleCreateAlbum}
                      disabled={!albumName.trim() || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Album"
                      )}
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
              {/* Edit Album Sheet */}
              <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Edit Album</SheetTitle>
                    <SheetDescription>
                      Update the name of your album.
                    </SheetDescription>
                  </SheetHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid gap-4">
                      <Label htmlFor="edit-album-name">Album Name</Label>
                      <Input
                        id="edit-album-name"
                        placeholder="e.g., Wedding Ceremony"
                        value={albumName}
                        onChange={(e) => setAlbumName(e.target.value)}
                      />
                    </div>
                  </div>

                  <SheetFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setAlbumName("");
                        setIsEditSheetOpen(false);
                      }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-primary hover:bg-pink-600 text-white"
                      onClick={handleUpdateAlbum}
                      disabled={!albumName.trim() || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Album"
                      )}
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          {/* Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Albums List */}
            <div className="lg:col-span-1">
              <div className="rounded-lg border p-4">
                <h2 className="text-lg font-semibold mb-4">Your Albums</h2>

                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">
                      Loading albums...
                    </span>
                  </div>
                ) : error ? (
                  <div className="text-center py-6">
                    <p className="text-red-500 mb-2">{error}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setLoading(true);
                        setError(null);
                      }}
                    >
                      Retry
                    </Button>
                  </div>
                ) : albums.length === 0 ? (
                  <div className="text-center py-8">
                    <FolderOpen className="h-12 w-12 text-primary mx-auto mb-2" />
                    <p className="text-muted-foreground mb-4">
                      No albums found. Create your first album to get started.
                    </p>
                    <Button
                      className="bg-primary hover:bg-pink-600 text-white"
                      onClick={() => setIsCreateSheetOpen(true)}
                    >
                      <Plus size={16} className="mr-2" />
                      Create Album
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {albums.map((album) => (
                      <div
                        key={album.id}
                        className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                          selectedAlbum?.id === album.id
                            ? "bg-accent border"
                            : "hover:bg-accent   border border-transparent"
                        }`}
                        onClick={() => setSelectedAlbum(album)}
                      >
                        <div className="flex items-center">
                          <Folder
                            className={`h-5 w-5 mr-2 ${
                              selectedAlbum?.id === album.id
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                          <span className="font-medium truncate">
                            {album.name.length > 20
                              ? `${album.name.substring(0, 20)}...`
                              : album.name}
                          </span>{" "}
                        </div>
                        <div className="flex items-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditSheet(album);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }}
                                    className="text-red-500 focus:text-red-500"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {`This will permanently delete the album "
                                      ${album.name}" and all its photos. This
                                      action cannot be undone.`}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-red-500 hover:bg-red-600"
                                      onClick={() =>
                                        handleDeleteAlbum(album.id)
                                      }
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Photos Grid */}
            <div className="lg:col-span-3">
              {selectedAlbum ? (
                <div className="rounded-lg border p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">
                      {selectedAlbum.name}
                    </h2>
                    <Button variant="outline" size="sm">
                      <Download size={16} className="mr-2" />
                      Download
                    </Button>
                  </div>

                  {photosLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="ml-2 text-muted-foreground">
                        Loading photos...
                      </span>
                    </div>
                  ) : photosError ? (
                    <div className="text-center py-6">
                      <p className="text-red-500 mb-2">{photosError}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPhotosLoading(true);
                          setPhotosError(null);
                          // Retry fetching
                          setTimeout(() => setPhotosLoading(false), 1000);
                        }}
                      >
                        Retry
                      </Button>
                    </div>
                  ) : photos.length === 0 ? (
                    <div className="text-center py-16 border rounded-lg">
                      <ImagePlus className="h-12 w-12 text-primary mx-auto mb-2" />
                      <p className="text-muted-foreground mb-4">
                        No photos in this album yet.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {photos.map((photo) => (
                        <Card key={photo.id} className="overflow-hidden">
                          <div
                            className="relative aspect-square cursor-pointer"
                            onClick={() =>
                              openFullScreenViewer(photos.indexOf(photo))
                            }
                          >
                            <Image
                              src={photo.media_url || "/placeholder.svg"}
                              alt="Photo"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-2 right-2">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    className="h-8 w-8 rounded-full opacity-80 hover:opacity-100"
                                    onClick={(e) => e.stopPropagation()} // Prevent opening fullscreen when delete button is clicked
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">
                                      Delete photo
                                    </span>
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete this photo.
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-red-500 hover:bg-red-600"
                                      onClick={() =>
                                        handleDeletePhoto(photo.id)
                                      }
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                          <CardFooter className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                <Image
                                  src={
                                    photo.guest.avatar ||
                                    "/placeholder.svg?height=32&width=32"
                                  }
                                  alt={photo.guest.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="text-sm">
                                <p className="font-medium">
                                  {photo.guest.name}
                                </p>
                              </div>
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full border rounded-lg p-8">
                  <div className="text-center">
                    <ImagePlus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Select an Album
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Choose an album from the list to view its photos
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add the full-screen photo viewer component at the end of the component, just before the Toaster */}
      {isFullScreenOpen && photos.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 z-10"
              onClick={() => setIsFullScreenOpen(false)}
            >
              <X size={24} />
            </button>

            {/* Previous button */}
            <button
              className="absolute left-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 z-10"
              onClick={showPreviousPhoto}
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next button */}
            <button
              className="absolute right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 z-10"
              onClick={showNextPhoto}
            >
              <ChevronRight size={24} />
            </button>

            {/* Photo */}
            <div className="relative w-full h-full max-w-4xl max-h-[80vh] flex items-center justify-center p-4">
              <Image
                src={photos[currentPhotoIndex]?.media_url || "/placeholder.svg"}
                alt="Full screen photo"
                fill
                className="object-contain"
              />
            </div>

            {/* Photo info */}
            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              <p className="font-medium">
                Uploaded by {photos[currentPhotoIndex]?.guest.name}
              </p>
              <p className="text-sm text-gray-300">
                {currentPhotoIndex + 1} of {photos.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
