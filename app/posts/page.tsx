"use client";

import type React from "react";

import { useState, useEffect, useRef, useCallback } from "react";
import { ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Post } from "@/data/api";
import { axiosPrivate } from "@/lib/axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { useEvent } from "@/providers/EventProvider";
import { Skeleton } from "@/components/ui/skeleton";
import PostCard from "@/components/post-card";

export default function PostsPage() {
  const { currentEvent } = useEvent();
  // const eventId = currentEvent?.id || "";
  const eventId = "2ab273bd-bdfb-428b-b9b9-a1a39e034340";
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const { toast } = useToast();
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get(`/admin/event/${eventId}/post`, {
        params: {
          page,
          limit: 10,
        },
      });
      const { data, next } = res.data;
      setPosts((prev) => [...prev, ...data]);
      setHasNext(!!next);
      setPage((prev) => prev + 1);
    } catch (err) {
      toast({
        title: "Error fetching posts",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = useCallback(() => {
    if (!observerRef.current || loading || !hasNext) return;

    const { top } = observerRef.current.getBoundingClientRect();
    if (top <= window.innerHeight + 100) {
      fetchPosts();
    }
  }, [loading, hasNext]);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const deletePost = async (postId: string) => {
    try {
      await axiosPrivate.delete(`/admin/event/${eventId}/post/${postId}`);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      toast({
        title: "Post deleted",
        description: "The post has been successfully deleted.",
      });
    } catch (err) {
      toast({
        title: "Failed to delete post",
        description: "Something went wrong. Try again later.",
        variant: "destructive",
      });
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
              <h1 className="text-3xl font-bold mb-2">Events Posts</h1>
              <p className="text-muted-foreground">
                Checkout Event Posts from friends and family.
              </p>
            </div>
            {/* <Button className="bg-primary hover:bg-pink-600 text-white">
              <Plus size={16} className="mr-2" />
              Create Posts
            </Button> */}
          </div>

          {loading &&
            Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="p-4 space-y-4 max-w-xl mx-auto mt-6">
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="w-24 h-4" />
                    <Skeleton className="w-32 h-3" />
                  </div>
                </div>
                <Skeleton className="w-full h-20" />
                <Skeleton className="w-1/2 h-4" />
              </Card>
            ))}

          {posts.length === 0 && !loading ? (
            <div className="text-center py-12 border rounded-lg">
              <div className="flex justify-center mb-4">
                <ImageIcon className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Posts found</h3>
              <p className="text-muted-foreground mb-4">
                There are no posts available for this event.
              </p>
              {/* <Button className="bg-primary hover:bg-pink-600 text-white">
                <Plus size={16} className="mr-2" />
                Add Post
              </Button> */}
            </div>
          ) : (
            <ScrollArea className="max-w-xl mx-auto h-full">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  eventId={eventId}
                  onDelete={(deletedId) =>
                    setPosts((prev) => prev.filter((p) => p.id !== deletedId))
                  }
                />
              ))}
            </ScrollArea>
          )}

          {loading &&
            Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="p-4 space-y-4 max-w-xl mx-auto mt-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="w-24 h-4" />
                    <Skeleton className="w-32 h-3" />
                  </div>
                </div>
                <Skeleton className="w-full h-20" />
                <Skeleton className="w-1/2 h-4" />
              </Card>
            ))}

          <div ref={observerRef} className="h-10 mt-10"></div>
        </div>
      </main>
    </div>
  );
}
