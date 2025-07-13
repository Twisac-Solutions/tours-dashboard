"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Gift, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import { useEvent } from "@/providers/EventProvider";
import { axiosPrivate } from "@/lib/axios";
import { GiftItem, GiftsResponse, GiftStats } from "@/data/api";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function GiftsPage() {
  const { currentEvent } = useEvent();
  const eventId = currentEvent?.id ?? "";
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [giftStats, setGiftStats] = useState<GiftStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchGifts();
  }, [eventId]);

  useEffect(() => {
    const fetchGiftStats = async () => {
      try {
        setStatsLoading(true);
        const res = await axiosPrivate.get(
          `/admin/event/${eventId}/gifts/stats`,
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

    if (!loading) {
      fetchGiftStats();
    }
  }, [loading, eventId]);

  const fetchGifts = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get<GiftsResponse>(
        `/admin/event/${eventId}/gifts`,
      );
      if (response.status === 200) {
        setGifts(response.data.data);
      }
    } catch (err) {
      setError("Failed to load gifts");
      setLoading(false);
      console.error(err);
      toast({ title: "Error", description: "Failed to load gifts" });
    } finally {
      setLoading(false);
    }
  };

  const openEditGift = (giftId: string) => {
    router.push(`/gifts/${giftId}`);
  };

  return (
    <div>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Gift Contributions</h1>
              <p className="text-muted-foreground">
                Create gift registries and track contributions from your guests
              </p>
            </div>
            <Button
              onClick={() => router.push("/gifts/create")}
              className="bg-primary hover:bg-pink-600 text-white"
            >
              <Plus size={16} className="mr-2" />
              Add Gift
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">
                Loading gifts...
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
                    // Retry fetching
                    setTimeout(() => setLoading(false), 1000);
                  }}
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : gifts.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <div className="flex justify-center mb-4">
                <Gift className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No gifts found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first gift to your registry.
              </p>
              <Button
                onClick={() => router.push("/gifts/create")}
                className="bg-primary hover:bg-pink-600 text-white"
              >
                <Plus size={16} className="mr-2" />
                Add Your First Gift
              </Button>
            </div>
          ) : (
            <div>
              <div className="mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Contribution Statistics</CardTitle>
                    <CardDescription>
                      Overview of all contributions made to gifts
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
                          }}
                        >
                          Retry
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gifts.map((gift) => (
                  <Card key={gift.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <Image
                        src={gift.imageUrl || "/placeholder.svg"}
                        alt={gift.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">{gift.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Progress
                          </span>
                          <span className="font-medium">
                            {gift.achieved_percent}%
                          </span>
                        </div>
                        <Progress
                          value={gift.achieved_percent}
                          className="h-2"
                        />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Raised</span>
                          <span className="font-medium">
                            {formatCurrency(gift.achieved)} of{" "}
                            {formatCurrency(gift.goal)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <div className="flex justify-between w-full">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditGift(gift.id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
