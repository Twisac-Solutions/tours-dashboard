"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Calendar,
  ChevronRight,
  Clock,
  Edit,
  Loader,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TimePicker } from "@/components/ui/time-picker";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { axiosPrivate } from "@/lib/axios";
import { Label } from "@/components/ui/label";
import { ItineraryResponse } from "@/data/api";
import { toast } from "@/hooks/use-toast";
import { useEvent } from "@/providers/EventProvider";
import { Skeleton } from "@/components/ui/skeleton";

interface ItineraryItem {
  id: string;
  title: string;
  time: string;
}

export default function EventItinerary() {
  const { currentEvent } = useEvent();
  const eventId = currentEvent?.id ?? "";
  const [title, setTitle] = useState("");
  const [time, setTime] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchItinerary = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get<ItineraryResponse>(
        `/admin/event/${eventId}/itinerary`
      );
      const dataRespo = response.data.data[0];
      setItinerary(dataRespo.itineraryItems ?? []);
    } catch (error) {
      toast({ title: "Error fetching itinerary", variant: "destructive" });
      setItinerary([]);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (eventId) fetchItinerary();
  }, [eventId, fetchItinerary]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!time) {
      toast({ title: "Please select a time", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await axiosPrivate.post(`/admin/event/${eventId}/itinerary`, {
        title,
        time,
      });
      toast({ title: "Itinerary added!" });
      setTitle("");
      setTime(null);
      fetchItinerary();
    } catch (error) {
      toast({ title: "Failed to add itinerary", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosPrivate.delete(`/admin/event/${eventId}/itinerary-item/${id}`);
      toast({ title: "Itinerary deleted!" });
      setItinerary(itinerary.filter((item) => item.id !== id));
    } catch (error) {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  const handleUpdate = async () => {
    if (!editingItem || !editingItem.time) return;
    try {
      await axiosPrivate.patch(
        `/admin/event/${eventId}/itinerary-item/${editingItem.id}`,
        {
          title: editingItem.title,
          time: editingItem.time,
        }
      );
      toast({ title: "Itinerary updated!" });
      fetchItinerary();
      setEditingItem(null);
    } catch (error) {
      toast({ title: "Failed to update", variant: "destructive" });
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        {loading ? (
          <div className="flex flex-col space-y-2 animate-pulse">
            <Skeleton className="h-8 rounded w-1/3"></Skeleton>
            <Skeleton className="h-4 rounded w-1/2"></Skeleton>
          </div>
        ) : error ? (
          <div className="text-primary">{error}</div>
        ) : itinerary ? (
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Event Itinerary</h1>
            <p className="text-muted-foreground">
              Manage your event schedule and activities.
            </p>
          </div>
        ) : null}

        {/* Add Itinerary Item Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add Itinerary Item</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Activity Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Wedding Ceremony"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <TimePicker
                    value={time}
                    onChange={setTime}
                    placeholder="Time"
                    required
                  />
                </div>
                <div className="md:col-span-3">
                  <Button
                    className="w-full md:w-auto bg-primary hover:bg-pink-600 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus size={16} className="mr-2" />
                        Add to Itinerary
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Itinerary Timeline */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Event Schedule</h2>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex animate-pulse">
                  <Skeleton className="w-20 h-6 rounded mr-4"></Skeleton>
                  <Skeleton className="flex-1 h-16 rounded"></Skeleton>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 border rounded-lg">
              <p className="text-primary mb-2">{error}</p>
              <Button
                variant="outline"
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  // Retry fetching
                  setTimeout(() => setLoading(false), 1000);
                }}
              >
                Retry
              </Button>
            </div>
          ) : itinerary && itinerary.length === 0 ? (
            <div className="text-center py-8 border rounded-lg">
              <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No itinerary items yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Start adding items to create your event schedule.
              </p>
            </div>
          ) : itinerary ? (
            <div className="space-y-4 mt-8">
              {itinerary.map((item, index) => (
                <div key={item.id} className="relative">
                  <div className="flex flex-wrap items-start group">
                    <div className="w-16 flex-shrink-0 pb-2">
                      <span className="text-base font-medium text-muted-foreground">
                        {item.time}
                      </span>
                    </div>
                    <div className="w-12 flex-shrink-0 pb-2 mr-4  relative">
                      <div className="w-10 h-10 mx-auto rounded-full bg-primary z-10 relative items-center justify-center flex">
                        <Clock className="h-4 w-4 text-white" />
                      </div>

                      {index !== itinerary.length - 1 && (
                        <div className="h-10 w-0.5 bg-border mx-auto mt-3"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="border rounded-lg p-4 shadow-sm group-hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{item.title}</h3>
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity items-center">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => setEditingItem(item)}
                                >
                                  <Edit size={16} className="h-4 w-4 p-0" />
                                </Button>
                              </DialogTrigger>
                              {editingItem && (
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Itinerary</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <Input
                                      value={editingItem.title}
                                      onChange={(e) =>
                                        setEditingItem({
                                          ...editingItem,
                                          title: e.target.value,
                                        })
                                      }
                                    />
                                    <TimePicker
                                      value={editingItem.time}
                                      onChange={(newTime) =>
                                        setEditingItem({
                                          ...editingItem,
                                          time: newTime,
                                        })
                                      }
                                    />
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      onClick={() => setEditingItem(null)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button onClick={handleUpdate}>
                                      Save Changes
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              )}
                            </Dialog>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-gray-500 hover:text-primary"
                                >
                                  <Trash2 size={16} />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete this itinerary
                                    item. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-primary hover:bg-red-600 text-white"
                                    onClick={() => handleDelete(item.id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
