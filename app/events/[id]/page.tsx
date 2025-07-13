"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
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
import { Loader2 } from "lucide-react";
import { axiosPrivate } from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";

export default function EventDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { toast } = useToast();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axiosPrivate.get(`/admin/event/${id}`);
        setEvent(response.data.data);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Handle delete event
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axiosPrivate.delete(`/admin/event/${id}`);
      toast({ title: "Event deleted successfully!" });
      router.push("/events"); // Redirect after delete
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({ title: "Failed to delete event." });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-6 w-6 text-primary" />
      </div>
    );
  }

  if (!event) {
    return <p className="text-center text-gray-500">Event not found.</p>;
  }

  return (
    <div className="flex-1 flex flex-col sm:px-16 px-6 py-6">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-medium mb-4">{event.name}</h1>

        <div className="space-y-4">
          <p>
            <strong>Date:</strong> {new Date(event.date).toLocaleString()}
          </p>
          <p>
            <strong>Location:</strong> {event.location}
          </p>
          <p>
            <strong>Description:</strong> {event.description}
          </p>
          <p>
            <strong>Bride:</strong> {event.bride}
          </p>
          <p>
            <strong>Groom:</strong> {event.groom}
          </p>
        </div>

        <div className="flex gap-4 mt-6">
          <Button
            type="button"
            onClick={() => router.push(`/events/edit/${id}`)}
          >
            Edit
          </Button>

          {/* DELETE BUTTON with AlertDialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Do you really want to delete
                  this event?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                  {deleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
