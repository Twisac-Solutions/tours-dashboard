"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Ban,
  Check,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  User,
  UserX,
  LayoutGrid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

// Define types for the API responses
interface EventInfo {
  id: string;
  name: string;
}

interface UserInfo {
  id: string;
  name: string;
  avatar: string;
}

interface Guest {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  chat_token: string;
  avatar_set: boolean;
  read_only: boolean;
  relationshipStatus: "Single" | "Married" | "Engaged" | "In a relationship";
  gender: "Male" | "Female" | "Other" | "Prefer not to say";
  event: EventInfo;
  user: UserInfo;
  isBlocked: boolean;
}

interface GuestsResponse {
  metadata: {
    total: number;
  };
  data: Guest[];
}

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isGuestDetailsOpen, setIsGuestDetailsOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [isUnblockDialogOpen, setIsUnblockDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mock event ID (in a real app, this would come from context or params)
  const eventId = "59579266-145d-4edd-8612-772f52c2e2bf";

  // Fetch guests
  useEffect(() => {
    const fetchGuests = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch data from an API
        // For demo purposes, we'll simulate a response

        // Uncomment this in a real application:
        // const response = await fetch(`/admin/event/${eventId}/guests`);
        // const data = await response.json();
        // setGuests(data.data);

        // Simulate API call
        setTimeout(() => {
          const mockGuests: Guest[] = [
            {
              id: "guest1",
              name: "John Smith",
              email: "john.smith@example.com",
              bio: "Friend of the groom",
              avatar:
                "https://res.cloudinary.com/dmvqaxwke/image/upload/v1742028180/au9ijbhkqdhvgzmkyt2q.jpg",
              chat_token: "token123",
              avatar_set: true,
              read_only: false,
              relationshipStatus: "Married",
              gender: "Male",
              event: {
                id: eventId,
                name: "Wedding Ceremony",
              },
              user: {
                id: "user1",
                name: "John Smith",
                avatar:
                  "https://res.cloudinary.com/dmvqaxwke/image/upload/v1742028180/au9ijbhkqdhvgzmkyt2q.jpg",
              },
              isBlocked: false,
            },
            {
              id: "guest2",
              name: "Sarah Johnson",
              email: "sarah.johnson@example.com",
              bio: "Bride's sister",
              avatar:
                "https://res.cloudinary.com/dmvqaxwke/image/upload/v1741960918/yxxmrkcn2tyryozvl4y1.jpg",
              chat_token: "token456",
              avatar_set: true,
              read_only: false,
              relationshipStatus: "Single",
              gender: "Female",
              event: {
                id: eventId,
                name: "Wedding Ceremony",
              },
              user: {
                id: "user2",
                name: "Sarah Johnson",
                avatar:
                  "https://res.cloudinary.com/dmvqaxwke/image/upload/v1741960918/yxxmrkcn2tyryozvl4y1.jpg",
              },
              isBlocked: false,
            },
            {
              id: "guest3",
              name: "Michael Brown",
              email: "michael.brown@example.com",
              bio: "College friend",
              avatar:
                "https://res.cloudinary.com/dmvqaxwke/image/upload/v1742028146/ev263vdoumfvljzlt56n.jpg",
              chat_token: "token789",
              avatar_set: true,
              read_only: false,
              relationshipStatus: "In a relationship",
              gender: "Male",
              event: {
                id: eventId,
                name: "Wedding Ceremony",
              },
              user: {
                id: "user3",
                name: "Michael Brown",
                avatar:
                  "https://res.cloudinary.com/dmvqaxwke/image/upload/v1742028146/ev263vdoumfvljzlt56n.jpg",
              },
              isBlocked: true,
            },
            {
              id: "guest4",
              name: "Emily Davis",
              email: "emily.davis@example.com",
              bio: "Childhood friend",
              avatar:
                "https://res.cloudinary.com/dmvqaxwke/image/upload/v1742025477/lnxgnewiircjlqkjvxpz.jpg",
              chat_token: "token101",
              avatar_set: true,
              read_only: false,
              relationshipStatus: "Engaged",
              gender: "Female",
              event: {
                id: eventId,
                name: "Wedding Ceremony",
              },
              user: {
                id: "user4",
                name: "Emily Davis",
                avatar:
                  "https://res.cloudinary.com/dmvqaxwke/image/upload/v1742025477/lnxgnewiircjlqkjvxpz.jpg",
              },
              isBlocked: false,
            },
            {
              id: "guest5",
              name: "Robert Wilson",
              email: "robert.wilson@example.com",
              bio: "Groom's brother",
              avatar:
                "https://res.cloudinary.com/dmvqaxwke/image/upload/v1742025477/cfj6iofgpw0ykswsrdue.jpg",
              chat_token: "token202",
              avatar_set: true,
              read_only: false,
              relationshipStatus: "Married",
              gender: "Male",
              event: {
                id: eventId,
                name: "Wedding Ceremony",
              },
              user: {
                id: "user5",
                name: "Robert Wilson",
                avatar:
                  "https://res.cloudinary.com/dmvqaxwke/image/upload/v1742025477/cfj6iofgpw0ykswsrdue.jpg",
              },
              isBlocked: false,
            },
          ];
          setGuests(mockGuests);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Failed to fetch guests:", error);
        setError("Failed to load guests. Please try again.");
        setLoading(false);
      }
    };

    fetchGuests();
  }, [eventId]);

  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Handle blocking a guest
  const handleBlockGuest = async () => {
    if (!selectedGuest) return;

    try {
      setIsSubmitting(true);

      // In a real app, you would make an API call to block the guest
      // For demo purposes, we'll simulate the API call

      // Uncomment this in a real application:
      // await fetch(`/admin/event/${eventId}/guests/${selectedGuest.id}/block`, {
      //   method: 'POST',
      // });

      // Simulate API call
      setTimeout(() => {
        const updatedGuests = guests.map((guest) =>
          guest.id === selectedGuest.id ? { ...guest, isBlocked: true } : guest,
        );

        setGuests(updatedGuests);
        setSelectedGuest(null);
        setIsSubmitting(false);
        setIsBlockDialogOpen(false);

        toast({
          title: "Guest blocked",
          description: "The guest has been blocked successfully.",
        });
      }, 1000);
    } catch (error) {
      console.error("Failed to block guest:", error);
      setIsSubmitting(false);

      toast({
        title: "Error",
        description: "Failed to block guest. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUnblockGuest = async () => {
    if (!selectedGuest) return;

    try {
      setIsSubmitting(true);

      // In a real app, you would make an API call to unblock the guest
      // For demo purposes, we'll simulate the API call

      // Uncomment this in a real application:
      // await fetch(`/admin/event/${eventId}/guests/${selectedGuest.id}/unblock`, {
      //   method: 'POST',
      // });

      // Simulate API call
      setTimeout(() => {
        const updatedGuests = guests.map((guest) =>
          guest.id === selectedGuest.id
            ? { ...guest, isBlocked: false }
            : guest,
        );

        setGuests(updatedGuests);
        setSelectedGuest(null);
        setIsSubmitting(false);
        setIsUnblockDialogOpen(false);

        toast({
          title: "Guest unblocked",
          description: "The guest has been unblocked successfully.",
        });
      }, 1000);
    } catch (error) {
      console.error("Failed to unblock guest:", error);
      setIsSubmitting(false);

      toast({
        title: "Error",
        description: "Failed to unblock guest. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openGuestDetails = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsGuestDetailsOpen(true);
  };

  const openBlockDialog = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsBlockDialogOpen(true);
  };

  const openUnblockDialog = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsUnblockDialogOpen(true);
  };

  return (
    <div>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Guest Management</h1>
              <p className="text-muted-foreground">
                View and manage guests for your event
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search guests..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center border rounded-md overflow-hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-9 px-3 rounded-none ${viewMode === "grid" ? "bg-muted" : ""}`}
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-9 px-3 rounded-none ${viewMode === "list" ? "bg-muted" : ""}`}
                    onClick={() => setViewMode("list")}
                  >
                    <List size={16} />
                  </Button>
                </div>
              </div>

              <Button className="bg-primary hover:bg-pink-600 text-white">
                <Plus size={16} className="mr-2" />
                Add Guest
              </Button>
            </div>
          </div>

          <div className="mt-8">{renderGuestsList()}</div>
        </div>
      </main>

      {/* Guest Details Dialog */}
      <Dialog open={isGuestDetailsOpen} onOpenChange={setIsGuestDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Guest Details</DialogTitle>
            <DialogDescription>
              View detailed information about this guest.
            </DialogDescription>
          </DialogHeader>

          {selectedGuest && (
            <div className="py-4">
              <div className="flex flex-col items-center mb-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden mb-2">
                  <Image
                    src={
                      selectedGuest.avatar ||
                      "/placeholder.svg?height=96&width=96"
                    }
                    alt={selectedGuest.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold">{selectedGuest.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedGuest.email}
                </p>
                {selectedGuest.isBlocked && (
                  <Badge variant="destructive" className="mt-2">
                    Blocked
                  </Badge>
                )}
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">
                    Relationship Status
                  </div>
                  <div className="text-sm font-medium">
                    {selectedGuest.relationshipStatus}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Gender</div>
                  <div className="text-sm font-medium">
                    {selectedGuest.gender}
                  </div>
                </div>
                {selectedGuest.bio && (
                  <div className="pt-2">
                    <div className="text-sm text-muted-foreground mb-1">
                      Bio
                    </div>
                    <div className="text-sm">{selectedGuest.bio}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between sm:justify-between">
            {selectedGuest && selectedGuest.isBlocked ? (
              <Button
                variant="outline"
                className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                onClick={() => {
                  setIsGuestDetailsOpen(false);
                  openUnblockDialog(selectedGuest);
                }}
              >
                <Check size={16} className="mr-2" />
                Unblock Guest
              </Button>
            ) : (
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                onClick={() => {
                  setIsGuestDetailsOpen(false);
                  openBlockDialog(selectedGuest!);
                }}
              >
                <Ban size={16} className="mr-2" />
                Block Guest
              </Button>
            )}
            <Button onClick={() => setIsGuestDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block Guest Dialog */}
      <AlertDialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Block Guest</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to block {selectedGuest?.name}? They will no
              longer be able to interact with your event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleBlockGuest}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Blocking...
                </>
              ) : (
                "Block Guest"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unblock Guest Dialog */}
      <AlertDialog
        open={isUnblockDialogOpen}
        onOpenChange={setIsUnblockDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unblock Guest</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unblock {selectedGuest?.name}? They will
              be able to interact with your event again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-500 hover:bg-green-600"
              onClick={handleUnblockGuest}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Unblocking...
                </>
              ) : (
                "Unblock Guest"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  function renderGuestsList() {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading guests...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-2">{error}</p>
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
        </div>
      );
    }

    if (filteredGuests.length === 0) {
      return (
        <div className="text-center py-12 border rounded-lg ">
          <User className="h-12 w-12 text-primary mx-auto mb-2" />
          <h3 className="text-lg font-medium mb-2">No guests found</h3>
          {searchQuery ? (
            <p className="text-muted-foreground mb-4">
              No guests match your search. Try a different query or clear the
              search.
            </p>
          ) : (
            <p className="text-muted-foreground mb-4">
              Start by adding guests to your event.
            </p>
          )}

          {searchQuery ? (
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          ) : (
            <Button className="bg-primary hover:bg-pink-600 text-white">
              <Plus size={16} className="mr-2" />
              Add Your First Guest
            </Button>
          )}
        </div>
      );
    }

    // Grid View
    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuests.map((guest) => (
            <Card key={guest.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 flex items-start gap-4">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={guest.avatar || "/placeholder.svg"}
                      alt={guest.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-xl truncate">
                          {guest.name}
                        </h3>
                        <p className="text-base text-muted-foreground truncate">
                          {guest.email}
                        </p>
                      </div>
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
                            onClick={() => openGuestDetails(guest)}
                          >
                            <User className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {guest.isBlocked ? (
                            <DropdownMenuItem
                              onClick={() => openUnblockDialog(guest)}
                              className="text-green-600"
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Unblock Guest
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => openBlockDialog(guest)}
                              className="text-red-600"
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Block Guest
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center mt-2">
                      <Badge
                        variant={guest.isBlocked ? "destructive" : "outline"}
                        className="text-xs"
                      >
                        {guest.isBlocked ? (
                          <>
                            <UserX className="h-3 w-3 mr-1" />
                            Blocked
                          </>
                        ) : (
                          guest.relationshipStatus
                        )}
                      </Badge>
                      {guest.bio && !guest.isBlocked && (
                        <span className="text-sm text-muted-foreground ml-2 truncate">
                          {guest.bio}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-accent/15  flex justify-between items-center">
                  <span className="text-base text-muted-foreground">
                    {guest.gender}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-primary hover:text-pink-600 hover:bg-pink-50"
                    onClick={() => openGuestDetails(guest)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    // List/Table View
    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Guest
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Gender
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredGuests.map((guest) => (
                <tr key={guest.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={guest.avatar || "/placeholder.svg"}
                          alt={guest.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-medium">{guest.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {guest.email}
                  </td>
                  <td className="px-4 py-3">
                    {guest.isBlocked ? (
                      <Badge variant="destructive" className="text-xs">
                        <UserX className="h-3 w-3 mr-1" />
                        Blocked
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        {guest.relationshipStatus}
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {guest.gender}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-primary hover:text-pink-600 hover:bg-pink-50"
                        onClick={() => openGuestDetails(guest)}
                      >
                        View
                      </Button>
                      {guest.isBlocked ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => openUnblockDialog(guest)}
                        >
                          Unblock
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => openBlockDialog(guest)}
                        >
                          Block
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
