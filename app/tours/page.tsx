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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { axiosPrivate } from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { EventData } from "@/data/api";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEvent } from "@/providers/EventProvider";
import { useToast } from "@/hooks/use-toast";

export default function EventsPage() {
  const { currentEvent, setCurrentEvent } = useEvent();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosPrivate.get("/event");

        setEvents(response.data.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const openEditDetail = (eventId: string) => {
    router.push(`/events/edit/${eventId}`);
  };

  const handleEventSelect = (event: EventData) => {
    setCurrentEvent(event);
    toast({
      title: "Event Switched",
      description: `Now viewing: ${event.name}`,
    });
  };

  return (
    <div className="flex-1 sm:px-16 px-6 py-6 overflow-auto">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold mb-2">
            Our Extensive Collection of Events
          </h1>
          <p className="text-muted-foreground">
            Your Dashboard for All Things Wedding! Here, you&apos;ll find a
            comprehensive view of our planning progress, performance metrics,
            and all the details you need to make your special day perfect!
          </p>
          <Button className="my-4">
            <Link href={"/events/create"} className="inline-flex">
              <Plus size={16} className="mr-2" />
              Create a New Event
            </Link>
          </Button>
        </div>

        <div className="md:flex items-center hidden">
          <div>
            <Image
              src="/assets/wed.png"
              alt="Wedding couple"
              width={150}
              height={150}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-primary text-white p-1 rounded-md ">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-white data-[state=active]:text-primary rounded px-6 py-2"
          >
            All Events
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-white data-[state=active]:text-primary rounded px-6 py-2"
          >
            Active Events
          </TabsTrigger>
          <TabsTrigger
            value="coming"
            className="data-[state=active]:bg-white data-[state=active]:text-primary rounded px-6 py-2"
          >
            Coming Up Events
          </TabsTrigger>
          <TabsTrigger
            value="old"
            className="data-[state=active]:bg-white data-[state=active]:text-primary rounded px-6 py-2"
          >
            Old Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
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
            <p>No events found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-6">
              {events.map((event) => (
                // <div key={event.id} className="border rounded-lg p-5">
                //   <Link
                //     href={`/events/edit/${event.id}`}
                //     className="font-semibold text-lg mb-3"
                //   >
                //     {event.name}
                //   </Link>
                //   <p className="text-sm text-muted-foreground mb-2">
                //     {event.description}
                //   </p>
                //   <div className="flex items-center text-sm text-muted-foreground mb-4">
                //     <MapPin className="h-4 w-4 mr-2" />
                //     {event.location}
                //   </div>
                //   <div className="text-sm font-medium text-gray-700">
                //     {format(new Date(event.date), "PPP p")}
                //   </div>
                // </div>
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
                      {event.id === currentEvent?.id && (
                        <Badge className="bg-green-500">Active</Badge>
                      )}
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
                        <DropdownMenuItem
                          onClick={() => openEditDetail(event.id)}
                        >
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
                                // onClick={() => handleDeleteVendor(vendor.id)}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
