"use client";

import Image from "next/image";
import {
  Bell,
  Calendar,
  Edit,
  Home,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
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
import { EventData } from "@/data/api";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useProfileStore } from "@/store/useProfileStore";

export default function HomePage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const { profile } = useProfileStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);
  const fetchEvents = async () => {
    try {
      const response = await axiosPrivate.get("/admin/event");

      setEvents(response.data.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };
  const openEditDetail = (eventId: string) => {
    router.push(`/events/edit/${eventId}`);
  };

  const handleEventSelect = (event: EventData) => {
    toast({
      title: "Event Switched",
      description: `Now viewing: ${event.name}`,
    });
    window.location.href = `/`;
  };

  const handleDeleteEvent = async (selectedEventId: string) => {
    setLoading(true);
    try {
      await axiosPrivate.delete(`/admin/event/${selectedEventId}`);
      toast({
        title: "Event Deleted",
      });
      fetchEvents();
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

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex-1 sm:px-16 px-6 py-6 overflow-auto">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 ">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold mb-2">
            Welcome Back, {profile?.name}!
          </h1>
          <p className="text-muted-foreground">
            Select an event to manage or create a new one. Your workspace gives
            you access to all your event planning tools and resources in one
            place.
          </p>
        </div>

        {/* <div className="md:flex items-center hidden">
          <div>
            <Image
              src="/assets/wed.png"
              alt="Wedding couple"
              width={150}
              height={150}
              className="object-contain"
            />
          </div>
        </div> */}
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => router.push("/events/create")}>
          <Plus size={16} className="mr-2" />
          Create a New Event
        </Button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-6">
          {/* Skeleton Loader */}
          {[...Array(3)].map((_, index) => (
            <div key={index} className="border rounded-lg p-5">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-6 w-1/3" />
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 border rounded-lg ">
          <div className="flex justify-center mb-4">
            <Calendar className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-xl font-medium mb-2">No events found</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            You don&apos;t have any events yet. Create your first event to get
            started with planning.
          </p>

          <Button
            className="bg-primary hover:bg-pink-600 text-white"
            onClick={() => router.push("/events/create")}
          >
            <Plus size={16} className="mr-2" />
            Create Your First Event
          </Button>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-8 border rounded-lg ">
          <p className="text-muted-foreground">
            No events match your search. Try a different query.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-6">
          {filteredEvents.map((event) => (
            <Card
              key={event.id}
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              // onClick={() => selectEvent(event.id)}
            >
              <div className="relative h-52">
                {event.mediaUrls && event.mediaUrls.length > 0 ? (
                  <Image
                    src={event.mediaUrls[0] || "/placeholder.svg"}
                    alt={event.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-accent flex items-center justify-center">
                    <Calendar className="h-16 w-16 text-primary" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge className="bg-green-500">Featured</Badge>
                </div>
              </div>
              <CardHeader className="pb-1 items-center pt-2 flex flex-row justify-between">
                <CardTitle
                  className="text-xl  cursor-pointer hover:text-primary transition-colors"
                  onClick={() => openEditDetail(event.id)}
                >
                  {event.name}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditDetail(event.id)}>
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
                            {`This will permanently delete the Event"
                                ${event.name}". This action cannot be undone`}
                            .
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => handleDeleteEvent(event.id)}
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
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{event.location}</span>
                </div>
                <p className="text-muted-foreground line-clamp-2 min-h-12">
                  {event.description}
                </p>
              </CardContent>
              <CardFooter className="p-2 px-6 pb-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleEventSelect(event)}
                >
                  Select Event
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
