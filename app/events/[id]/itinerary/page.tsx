"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChevronRight, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
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

interface ItineraryItem {
  id: string;
  title: string;
  time: string;
}

export default function EventItinerary() {
  const { eventId } = useParams();
  const [title, setTitle] = useState("");
  const [time, setTime] = useState<string | null>(null); // Use null for controlled Time Picker
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch itinerary items
  const fetchItinerary = async () => {
    try {
      const { data } = await axiosPrivate.get(
        `/admin/event/${eventId}/itinerary`
      );
      setItinerary(data);
    } catch (error) {
      toast({ title: "Error fetching itinerary", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (eventId) fetchItinerary();
  }, [eventId]);

  // Create new itinerary item
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

  // Delete itinerary item
  const handleDelete = async (id: string) => {
    try {
      await axiosPrivate.delete(`/admin/event/${eventId}/itinerary-item/${id}`);
      toast({ title: "Itinerary deleted!" });
      setItinerary(itinerary.filter((item) => item.id !== id));
    } catch (error) {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  // Update itinerary item
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
            <span className="text-primary">Dashboard</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span>Itinerary</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
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

            <div>
              <div className="mb-10">
                <h1 className="text-xl font-medium mb-2">Schedule Time</h1>
                <p className="text-muted-foreground">
                  View and manage the schedule of events.
                </p>
              </div>
              <Card className="p-6 space-y-4 min-h-64">
                {itinerary.length === 0 ? (
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
                              ✏️
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
                                  variant="outline"
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
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
