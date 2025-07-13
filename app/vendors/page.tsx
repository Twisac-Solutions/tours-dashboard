"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Edit,
  Loader2,
  MoreHorizontal,
  Plus,
  Store,
  Trash2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useEvent } from "@/providers/EventProvider";
import { axiosPrivate } from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { VendorDetailSection } from "@/data/api";

export default function VendorsPage() {
  const { currentEvent } = useEvent();
  const [vendorSections, setVendorSections] = useState<VendorDetailSection[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const eventId = currentEvent?.id ?? "";
  const router = useRouter();

  const { toast } = useToast();

  // Fetch vendor details
  useEffect(() => {
    fetchVendorDetails();
  }, [eventId]);

  const fetchVendorDetails = async () => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get(
        `/admin/event/${eventId}/vendor-detail`
      );
      if (res.status == 200) {
        console.log(res.data.data[0]);
        setVendorSections(res.data.data[0].sections);
      }
    } catch (err) {
      toast({
        title: "Failed to load vendor details",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openVendorDetail = (vendorId: string) => {
    router.push(`/vendors/${vendorId}`);
  };

  const openVendorCreator = () => {
    router.push(`/vendors/create`);
  };

  const handleDeleteVendor = async (sectionId: string) => {
    setLoading(true);
    try {
      await axiosPrivate.delete(
        `/admin/event/${eventId}/vendor-detail/${sectionId}`
      );
      toast({
        title: "Vendor detail deleted",
      });
      fetchVendorDetails();
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

  return (
    <div>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Vendors</h1>
              <p className="text-muted-foreground">
                Manage all your wedding vendors and service providers in one
                place
              </p>
            </div>

            <Button
              className="bg-primary hover:bg-pink-600 text-white"
              onClick={() => openVendorCreator()}
            >
              <Plus size={16} className="mr-2" />
              Add Vendor
            </Button>
          </div>

          {/* Vendors Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">
                Loading vendors...
              </span>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <p className="text-red-500 mb-2">{error}</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setLoading(true);
                    setError(null);
                    setLoading(false);
                  }}
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : vendorSections?.length === 0 ? (
            <div className="text-center py-12 border rounded-lg ">
              <div className="flex justify-center mb-4">
                <Store className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No vendors found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first vendor to help organize your
                wedding.
              </p>

              <Button
                className="bg-primary hover:bg-pink-600 text-white"
                onClick={() => openVendorCreator()}
              >
                <Plus size={16} className="mr-2" />
                Add Your First Vendor
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendorSections?.map((vendor) => (
                <Card key={vendor.id} className="overflow-hidden">
                  <div
                    className="relative h-52 cursor-pointer"
                    onClick={() => openVendorDetail(vendor.id)}
                  >
                    {vendor.mediaUrls && vendor.mediaUrls.length > 0 ? (
                      <Image
                        src={vendor.mediaUrls[0]}
                        alt={vendor.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                        <User className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2 flex flex-row justify-between items-start">
                    <CardTitle
                      className="text-xl cursor-pointer hover:text-primary transition-colors"
                      onClick={() => openVendorDetail(vendor.id)}
                    >
                      {vendor.title}
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
                          onClick={() => openVendorDetail(vendor.id)}
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
                                {`This will permanently delete the vendor "
                                ${vendor.title}". This action cannot be undone`}
                                .
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => handleDeleteVendor(vendor.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-muted-foreground line-clamp-2">
                      {vendor.content}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => openVendorDetail(vendor.id)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
