"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChevronRight, Pencil, Plus, X } from "lucide-react";
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
import { axiosPrivate } from "@/lib/axios";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ItineraryResponse } from "@/data/api";
import { toast } from "@/hooks/use-toast";

interface ItineraryItem {
  id: string;
  title: string;
  time: string;
}

export default function EventItinerary() {
  const { id } = useParams();
  const eventId = id || "";
  const [title, setTitle] = useState("");
  const [time, setTime] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    <div className="flex-1 flex flex-col">
      <main className="flex-1 sm:px-16 px-6 py-6 overflow-auto">
        <div className="max-w-4xl">
          <h1 className="text-2xl font-medium mb-2">Event Itinerary</h1>

          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-primary">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span>Itinerary</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h1 className="text-xl font-medium mb-2">Create Itinerary</h1>
                <p className="text-muted-foreground">
                  Fill in the form below to add a new itinerary item.
                </p>
              </div>
              <div>
                <Label className="block mb-2 font-medium">Title</Label>
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="block mb-2 font-medium">Time</Label>
                <TimePicker
                  value={time}
                  onChange={setTime}
                  placeholder="Time"
                  required
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Adding..." : "Add Itinerary"}
              </Button>
            </form>

            {/* Right: List of Itinerary Items */}
            <div>
              <div className="mb-10">
                <h1 className="text-xl font-medium mb-2">Schedule Time</h1>
                <p className="text-muted-foreground">
                  View and manage the schedule of events.
                </p>
              </div>
              <div className="p-4 space-y-4 min-h-64 border rounded-lg">
                {loading ? (
                  <p>Loading itinerary...</p>
                ) : itinerary.length === 0 ? (
                  <p className="text-muted-foreground">
                    No itinerary items yet.
                  </p>
                ) : (
                  itinerary.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center border rounded-lg p-2"
                    >
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.time}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => setEditingItem(item)}
                            >
                              <Pencil className="h-4 w-4" />
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
                                <Button onClick={() => setEditingItem(null)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleUpdate}>
                                  Save Changes
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          )}
                        </Dialog>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
