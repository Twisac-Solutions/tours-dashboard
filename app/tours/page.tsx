"use client";

import Image from "next/image";
import {
  Calendar,
  Edit,
  Home,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  TentTree,
  Trash2,
  TreePalmIcon,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useEffect, useState } from "react";
import { axiosPrivate } from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useProfileStore } from "@/store/useProfileStore";

export interface TourData {
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
  user: {
    id: string;
    name: string;
    profileImage: string;
    role: string;
    username: string;
  };
}

export default function ToursPage() {
  const [tours, setTours] = useState<TourData[]>([]);
  const { profile } = useProfileStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await axiosPrivate.get("/tours");
      setTours(response.data.data);
    } catch (error) {
      console.error("Error fetching tours:", error);
    } finally {
      setLoading(false);
    }
  };

  const openEditDetail = (tourId: string) => {
    router.push(`/tours/edit/${tourId}`);
  };

  const handleTourSelect = (tour: TourData) => {
    toast({
      title: "Tour Switched",
      description: `Now viewing: ${tour.title}`,
    });
    window.location.href = `/`;
  };

  const handleDeleteTour = async (selectedTourId: string) => {
    setLoading(true);
    try {
      await axiosPrivate.delete(`/tours/${selectedTourId}`);
      toast({
        title: "Tour Deleted",
      });
      fetchTours();
    } catch (err) {
      toast({
        title: "Failed to delete",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTours = tours.filter((tour) =>
    tour.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex-1 sm:px-16 px-6 py-6 overflow-auto">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold mb-2">
            Welcome Back, {profile?.name}!
          </h1>
          <p className="text-muted-foreground">
            Select a tour to manage or create a new one. Your workspace gives
            you access to all your tour planning tools and resources in one
            place.
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tours..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => router.push("/tours/create")}>
          <Plus size={16} className="mr-2" />
          Create a New Tour
        </Button>
      </div>
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="border rounded-lg p-5">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-6 w-1/3" />
            </div>
          ))}
        </div>
      ) : tours.length === 0 ? (
        <div className="text-center py-16 border rounded-lg">
          <div className="flex justify-center mb-4">
            <Calendar className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-xl font-medium mb-2">No tours found</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            You don&apos;t have any tours yet. Create your first tour to get
            started with planning.
          </p>
          <Button
            className="bg-primary hover:bg-pink-600 text-white"
            onClick={() => router.push("/tours/create")}
          >
            <Plus size={16} className="mr-2" />
            Create Your First Tour
          </Button>
        </div>
      ) : filteredTours.length === 0 ? (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-muted-foreground">
            No tours match your search. Try a different query.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-6">
          {filteredTours.map((tour) => (
            <Card
              key={tour.id}
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="relative h-52">
                {tour.coverImage ? (
                  <Image
                    src={tour.coverImage}
                    alt={tour.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-accent flex items-center justify-center">
                    <TentTree className="h-16 w-16 text-primary" />
                  </div>
                )}
                {tour.isFeatured && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-500">Featured</Badge>
                  </div>
                )}
              </div>
              <CardHeader className="pb-1 items-center pt-2 flex flex-row justify-between">
                <CardTitle
                  className="text-xl cursor-pointer hover:text-primary transition-colors"
                  onClick={() => openEditDetail(tour.id)}
                >
                  {tour.title}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditDetail(tour.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="text-red-500 focus:text-red-500"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the Tour `&quot;
                            {tour.title}
                            `&quot;. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => handleDeleteTour(tour.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{new Date(tour.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{tour.destination.name}</span>
                </div>
                <p className="text-muted-foreground line-clamp-2 min-h-12">
                  {tour.description}
                </p>
              </CardContent>
              <CardFooter className="p-2 px-6 pb-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleTourSelect(tour)}
                >
                  Select Tour
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
