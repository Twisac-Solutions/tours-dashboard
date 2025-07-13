"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, Eye, Send, Trash, Info, MoreHorizontal } from "lucide-react";
import { Post } from "@/data/api";
import { axiosPrivate } from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";

export default function PostCard({
  post,
  eventId,
  onDelete,
}: {
  post: Post;
  eventId: string;
  onDelete: (postId: string) => void;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const { toast } = useToast();

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setCurrentSlide(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const handleDelete = async () => {
    try {
      await axiosPrivate.delete(`/admin/event/${eventId}/post/${post.id}`);
      onDelete(post.id);
      toast({
        title: "Post deleted",
        description: "The post has been deleted successfully.",
      });
    } catch {
      toast({
        title: "Failed to delete post",
        description: "Something went wrong. Try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex-row items-center p-4 pb-0 space-y-0">
        <div className="flex items-center gap-2 flex-1">
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>
              {post.guest.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{post.guest.name}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(post.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleDelete}>
              <Trash className="mr-2 h-4 w-4 text-red-500" />
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Info className="mr-2 h-4 w-4" />
              Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 px-6 pb-2">
        <p className="mb-4">{post.content}</p>
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {post.mediaUrls?.map((url, idx) => (
              <div className="min-w-full relative aspect-square" key={idx}>
                <Image
                  src={url}
                  alt={`Image ${idx + 1}`}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-1 mt-2 mb-1">
          {post.mediaUrls?.map((_, idx) => (
            <CarouselDot key={idx} active={currentSlide === idx} />
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex w-full gap-4 p-2 pt-0 justify-between">
        <Button variant="ghost" size="sm">
          <Heart className="h-4 w-4 mr-2" />
          {post.likes}
        </Button>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          {post.views}
        </Button>
        <Button variant="ghost" size="sm">
          <Send className="h-4 w-4 mr-2" />
          {post.shares}
        </Button>
      </CardFooter>
    </Card>
  );
}

function CarouselDot({ active = false }: { active?: boolean }) {
  return (
    <div
      className={`h-1.5 w-1.5 rounded-full ${
        active ? "bg-primary" : "bg-muted-foreground/30"
      }`}
    />
  );
}
