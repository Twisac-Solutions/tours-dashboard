"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Edit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatDate } from "@/lib/utils";
import { axiosPrivate } from "@/lib/axios";
import ImageUploader from "@/components/custom/image-uploader";
import { useEvent } from "@/providers/EventProvider";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GiftStats } from "@/data/api";

// Define types for the API responses
interface GiftData {
  id: string;
  eventId: string;
  name: string;
  goal: number;
  achieved: number;
  achieved_percent: number;
  imageUrl: string;
}

// Add these interfaces after the existing interfaces
interface PaymentReceipt {
  reference: string | null;
  date: string;
  cc_number: string;
  cc_expire: string;
  fees: string;
  amount: string;
}

interface PaymentGift {
  id: string;
  name: string;
  imageUrl: string;
}

interface PaymentGuest {
  id: string;
  name: string;
  avatar: string;
}

interface Payment {
  id: string;
  eventId: string;
  giftId: string;
  amount: string;
  fee_percent: string;
  total_amount: string;
  message: string | null;
  reported: boolean | null;
  reason: string | null;
  status: "paid" | "failed" | "draft" | "draft";
  visible: boolean;
  receipt: PaymentReceipt;
  gift: PaymentGift;
  guest: PaymentGuest;
}

interface PaymentsResponse {
  metadata: {
    total: number;
  };
  data: Payment[];
}

export default function GiftDetailsPage() {
  const { currentEvent } = useEvent();
  const eventId = currentEvent?.id || "";
  const params = useParams();
  const giftId = params.id as string;

  // State for gift data and stats
  const [giftData, setGiftData] = useState<GiftData | null>(null);
  const [giftStats, setGiftStats] = useState<GiftStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // Add these state variables to the component
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [paymentsError, setPaymentsError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "paid" | "failed" | "draft"
  >("all");
  const [reportedFilter, setReportedFilter] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({ name: "", goal: 0 });

  // Fetch gift data
  useEffect(() => {
    fetchGiftData();
  }, [giftId, eventId]);
  const fetchGiftData = async () => {
    try {
      setLoading(true);
      const res = await axiosPrivate.get(
        `/admin/event/${eventId}/gifts/${giftId}`,
      );
      setFormData({ name: res.data.data.name, goal: res.data.data.goal });

      setGiftData(res.data.data);
      if (res.data.data.imageUrl) {
        setExistingImages([res.data.data.imageUrl]);
      } else {
        setExistingImages([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch gift data:", error);
      setError("Failed to load gift data. Please try again.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  // Fetch gift stats
  useEffect(() => {
    const fetchGiftStats = async () => {
      try {
        setStatsLoading(true);
        const res = await axiosPrivate.get(
          `/admin/event/${eventId}/gifts/${giftId}/stats`,
        );

        setGiftStats(res.data.data);
        setStatsLoading(false);
      } catch (error) {
        console.error("Failed to fetch gift stats:", error);
        setStatsLoading(false);
      } finally {
        setStatsLoading(false);
      }
    };

    if (!loading && giftData) {
      fetchGiftStats();
    }
  }, [loading, giftId, giftData, eventId]);

  // Add this useEffect to fetch payments
  useEffect(() => {
    const fetchPayments = async () => {
      if (!giftData) return;

      try {
        setPaymentsLoading(true);
        var paramArg = {};

        if (statusFilter !== "all") {
          paramArg = { status: statusFilter, reported: reportedFilter };
        } else {
          paramArg = { reported: reportedFilter };
        }

        const res = await axiosPrivate.get(
          `/admin/event/${eventId}/gifts/${giftId}/payments`,
          {
            params: paramArg,
          },
        );

        setPayments(res.data.data);
        setPaymentsLoading(false);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
        setPaymentsError("Failed to load payment data. Please try again.");
        setPaymentsLoading(false);
      } finally {
        setPaymentsLoading(false);
      }
    };

    if (giftData) {
      fetchPayments();
    }
  }, [giftData, giftId, eventId, statusFilter, reportedFilter]);

  const handleUpdateGift = async () => {
    if (!formData.name || !formData.goal) {
      toast({
        title: "Error",
        description: "Name and goal amount are required",
        variant: "destructive",
      });
      return;
    }
    const form = new FormData();
    form.append("name", formData.name);
    form.append("goal", formData.goal.toString());
    if (file) form.append("file", file);
    try {
      setIsSubmitting(true);

      const res = await axiosPrivate.patch(
        `/admin/event/${eventId}/gifts/${giftId}`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      setGiftData(res.data.data);
      setIsSubmitting(false);
      toast({
        title: "Gift updated",
        description: "The gift has been updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update gift:", error);
      setIsSubmitting(false);

      // Show error toast
      toast({
        title: "Error",
        description: "Failed to update gift. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Calculate remaining amount
  const getRemainingAmount = () => {
    if (!giftData) return 0;
    return Math.max(0, giftData.goal - giftData.achieved);
  };

  const handleDeleteGift = async (giftId: string) => {
    setLoading(true);
    try {
      await axiosPrivate.delete(`/admin/event/${eventId}/gifts/${giftId}`);
      toast({
        title: "Vendor detail deleted",
      });
      window.location.href = `/gifts`;
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
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">
                Loading gift details...
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-8 border rounded-lg">
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
          ) : giftData ? (
            <>
              {/* Gift Header */}
              <div className="flex flex-col md:flex-row gap-6 ">
                <div className="md:w-1/3">
                  <div className="relative h-72 w-full rounded-lg overflow-hidden border shadow-sm">
                    <Image
                      src={giftData.imageUrl || "/placeholder.svg"}
                      alt={giftData.name}
                      fill
                      loading="lazy"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">
                        {giftData.name}
                      </h1>
                      <p className="text-muted-foreground">
                        Gift ID: {giftData.id.substring(0, 8)}...
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Sheet>
                        <SheetTrigger>
                          {" "}
                          <Button variant="outline" size="sm">
                            <Edit size={16} className="mr-2" />
                            Edit
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Edit Gift</SheetTitle>
                            <SheetDescription>
                              Update the gift details
                            </SheetDescription>
                          </SheetHeader>
                          <div className="grid gap-4 py-4 pt-6">
                            <div className="grid gap-2">
                              <Label htmlFor="gift-name">Gift Name</Label>
                              <Input
                                id="gift-name"
                                placeholder="e.g., Honeymoon Fund"
                                value={formData.name}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="gift-goal">Goal Amount ($)</Label>
                              <Input
                                id="gift-goal"
                                type="number"
                                placeholder="e.g., 1000"
                                value={formData.goal}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    goal: Number(e.target.value),
                                  })
                                }
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label>Gift Image</Label>

                              <ImageUploader
                                existingImages={existingImages}
                                multiple={false}
                                value={file ? [file] : []}
                                onChange={(files) =>
                                  setFile(files?.[0] || null)
                                }
                              />
                            </div>
                          </div>
                          <div className="flex gap-4 justify-between">
                            <Button
                              className="bg-primary hover:bg-pink-600 text-white"
                              onClick={handleUpdateGift}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Updating...
                                </>
                              ) : (
                                "Save Changes"
                              )}
                            </Button>
                            <SheetClose>
                              <Button
                                disabled={isSubmitting}
                                variant={"secondary"}
                              >
                                Cancel
                              </Button>
                            </SheetClose>
                          </div>
                        </SheetContent>
                      </Sheet>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              {`This will permanently delete the Gift "
                                                                          ${giftData.name}". This action cannot be undone`}
                              .
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 hover:bg-red-600"
                              onClick={() => handleDeleteGift(giftData.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <Card className="mb-6">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">
                              Progress
                            </span>
                            <span className="font-medium">
                              {giftData.achieved_percent}%
                            </span>
                          </div>
                          <Progress
                            value={giftData.achieved_percent}
                            className="h-2"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">
                              Raised
                            </p>
                            <p className="text-2xl font-bold">
                              {formatCurrency(giftData.achieved)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              of {formatCurrency(giftData.goal)} goal
                            </p>
                          </div>

                          <div className=" p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">
                              Remaining
                            </p>
                            <p className="text-2xl font-bold">
                              {formatCurrency(getRemainingAmount())}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              to reach goal
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* stats */}
              <div className="mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contribution Statistics</CardTitle>
                    <CardDescription>
                      Overview of all contributions made to this gift
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {statsLoading ? (
                      <div className="flex justify-center items-center h-32">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">
                          Loading statistics...
                        </span>
                      </div>
                    ) : giftStats ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">
                            Total Contributions
                          </p>
                          <p className="text-2xl font-bold">
                            {giftStats.processed + giftStats.draft}
                          </p>
                        </div>

                        <div className="p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">
                            Processed
                          </p>
                          <p className="text-2xl font-bold">
                            {giftStats.processed}
                          </p>
                        </div>

                        <div className=" p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">
                            Pending
                          </p>
                          <p className="text-2xl font-bold">
                            {giftStats.draft}
                          </p>
                        </div>

                        <div className=" p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">
                            Failed
                          </p>
                          <p className="text-2xl font-bold">
                            {giftStats.failed}
                          </p>
                        </div>

                        <div className=" p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">
                            Total Amount
                          </p>
                          <p className="text-2xl font-bold">
                            {formatCurrency(giftStats.total_amount)}
                          </p>
                        </div>

                        <div className=" p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">
                            Processing Fees
                          </p>
                          <p className="text-2xl font-bold">
                            {formatCurrency(giftStats.total_fees)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">
                          Failed to load statistics
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            setStatsLoading(true);
                            // Retry fetching stats
                            setTimeout(() => setStatsLoading(false), 1000);
                          }}
                        >
                          Retry
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              {/* payments */}
              <div className="space-y-6">
                <h1 className="text-2xl font-semibold">Contribitions</h1>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={statusFilter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter("all")}
                      className={
                        statusFilter === "all"
                          ? "bg-primary hover:bg-pink-600"
                          : ""
                      }
                    >
                      All
                    </Button>
                    <Button
                      variant={statusFilter === "paid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter("paid")}
                      className={
                        statusFilter === "paid"
                          ? "bg-green-500 hover:bg-green-600"
                          : ""
                      }
                    >
                      Paid
                    </Button>
                    <Button
                      variant={statusFilter === "draft" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter("draft")}
                      className={
                        statusFilter === "draft"
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : ""
                      }
                    >
                      Pending
                    </Button>
                    <Button
                      variant={
                        statusFilter === "failed" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setStatusFilter("failed")}
                      className={
                        statusFilter === "failed" ? "0 hover:bg-red-600" : ""
                      }
                    >
                      Failed
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={reportedFilter === true ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setReportedFilter(reportedFilter === true ? null : true)
                      }
                      className={
                        reportedFilter === true
                          ? "bg-orange-500 hover:bg-orange-600"
                          : ""
                      }
                    >
                      Reported
                    </Button>
                  </div>
                </div>

                {/* Payments List */}
                {paymentsLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">
                      Loading payments...
                    </span>
                  </div>
                ) : paymentsError ? (
                  <div className="text-center py-6">
                    <p className="text-red-500">{paymentsError}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        setPaymentsLoading(true);
                        setPaymentsError(null);
                        // Retry fetching
                        setTimeout(() => setPaymentsLoading(false), 1000);
                      }}
                    >
                      Retry
                    </Button>
                  </div>
                ) : payments.length === 0 ? (
                  <div className="text-center py-8 border rounded-lg">
                    <p className="text-muted-foreground mb-2">
                      No payments found matching your filters
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setStatusFilter("all");
                        setReportedFilter(null);
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <Card key={payment.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="p-4 md:w-1/4 flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src={
                                  payment.guest.avatar ||
                                  "/placeholder-user.svg"
                                }
                              />
                              <AvatarFallback>
                                {payment.guest.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {payment.guest.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {/* {formatDate(payment.receipt.date)} */}
                              </p>
                            </div>
                          </div>

                          <div className="p-4 md:w-2/4 border-t md:border-t-0 md:border-l">
                            <div className="flex justify-between mb-2">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Amount
                                </p>
                                <p className="font-bold">
                                  {formatCurrency(Number(payment.amount))}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Total (with fees)
                                </p>
                                <p className="font-medium">
                                  {formatCurrency(Number(payment.total_amount))}
                                </p>
                              </div>
                            </div>

                            {payment.message && (
                              <div className="mt-2">
                                <p className="text-sm text-muted-foreground">
                                  Message
                                </p>
                                <p className="text-sm italic">
                                  {`"${payment.message}"`}
                                </p>
                              </div>
                            )}

                            {payment.reason && (
                              <div className="mt-2">
                                <p className="text-sm text-red-500">
                                  Reason: {payment.reason}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="p-4 md:w-1/4 border-t md:border-t-0 md:border-l flex flex-col justify-center items-center">
                            <div className="mb-2">
                              {payment.status === "paid" && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Paid
                                </span>
                              )}
                              {payment.status === "draft" && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Pending
                                </span>
                              )}
                              {payment.status === "failed" && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Failed
                                </span>
                              )}
                            </div>

                            {payment.reported && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                Reported
                              </span>
                            )}

                            <div className="mt-2 text-xs text-muted-foreground">
                              ID: {payment.id.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}
